function waitForImage(img) {
    if (!img) {
        return Promise.resolve();
    }

    if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
    });
}

function delay(ms, signal) {
    return new Promise((resolve) => {
        if (signal?.aborted) {
            resolve();
            return;
        }

        const timer = window.setTimeout(resolve, ms);

        signal?.addEventListener(
            'abort',
            () => {
                window.clearTimeout(timer);
                resolve();
            },
            { once: true },
        );
    });
}

function getCriticalImages() {
    const seen = new Set();

    return [...document.querySelectorAll('img[loading="eager"], header img, [data-splash-logo]')]
        .filter((img) => {
            if (!img || seen.has(img)) {
                return false;
            }

            seen.add(img);
            return true;
        });
}

/**
 * Waits for document, fonts, and above-the-fold images while reporting 0–1 progress.
 */
export async function waitForSiteReady({
    onProgress,
    signal,
    minDuration = 2400,
    maxDuration = 9000,
} = {}) {
    const start = performance.now();
    let current = 0;

    const report = (value) => {
        current = Math.max(current, Math.min(1, value));
        onProgress?.(current);
    };

    const remaining = () => Math.max(0, maxDuration - (performance.now() - start));

    report(0.06);

    if (document.readyState !== 'complete') {
        await Promise.race([
            new Promise((resolve) => window.addEventListener('load', resolve, { once: true })),
            delay(remaining(), signal),
        ]);
    }

    report(0.24);

    try {
        await Promise.race([document.fonts.ready, delay(remaining(), signal)]);
    } catch {
        // Font loading is best-effort; splash should not block on failure.
    }

    report(0.48);

    const images = getCriticalImages();

    await Promise.race([Promise.all(images.map(waitForImage)), delay(remaining(), signal)]);

    report(0.82);

    const elapsed = performance.now() - start;

    if (elapsed < minDuration) {
        const hold = minDuration - elapsed;
        const steps = 6;
        const stepMs = hold / steps;

        for (let i = 1; i <= steps; i += 1) {
            await delay(stepMs, signal);
            report(0.82 + (0.18 * i) / steps);
        }
    } else {
        report(1);
    }

    report(1);

    return { elapsed: performance.now() - start };
}
