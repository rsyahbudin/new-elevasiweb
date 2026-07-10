import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePage } from '@inertiajs/react';

const SWIPE_THRESHOLD = 48;
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_ZOOM = 2.5;

function resolvePreviewSrc(image) {
    return image?.fullUrl || image?.url || null;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function touchDistance(touches) {
    const [first, second] = touches;
    const dx = first.clientX - second.clientX;
    const dy = first.clientY - second.clientY;

    return Math.hypot(dx, dy);
}

function clampPan(scale, x, y, width, height) {
    if (scale <= 1) {
        return { x: 0, y: 0 };
    }

    const maxX = ((scale - 1) * width) / 2;
    const maxY = ((scale - 1) * height) / 2;

    return {
        x: clamp(x, -maxX, maxX),
        y: clamp(y, -maxY, maxY),
    };
}

export default function ImageLightbox({ images, index, onClose, onNavigate }) {
    const labelId = useId();
    const scrollLockY = useRef(0);
    const viewportRef = useRef(null);
    const lastTapRef = useRef(0);
    const gestureRef = useRef({
        mode: null,
        pinchStartDistance: 0,
        pinchStartScale: 1,
        panStartX: 0,
        panStartY: 0,
        panOriginX: 0,
        panOriginY: 0,
        swipeStartX: null,
    });

    const [isMounted, setIsMounted] = useState(false);
    const [isImageReady, setIsImageReady] = useState(false);
    const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
    const [isGesturing, setIsGesturing] = useState(false);
    const { locale } = usePage().props;

    const isOpen = index !== null;
    const current = isOpen ? images[index] : null;
    const previewSrc = resolvePreviewSrc(current);
    const isZoomed = zoom.scale > 1.01;

    const showPrevious = useCallback(() => {
        onNavigate((index - 1 + images.length) % images.length);
    }, [index, images.length, onNavigate]);

    const showNext = useCallback(() => {
        onNavigate((index + 1) % images.length);
    }, [index, images.length, onNavigate]);

    const resetZoom = useCallback(() => {
        setZoom({ scale: 1, x: 0, y: 0 });
        gestureRef.current.mode = null;
        gestureRef.current.swipeStartX = null;
    }, []);

    const applyZoom = useCallback((getNext) => {
        setZoom((prev) => {
            const viewport = viewportRef.current;
            const width = viewport?.clientWidth ?? 0;
            const height = viewport?.clientHeight ?? 0;
            const raw = typeof getNext === 'function' ? getNext(prev) : getNext;
            const scale = clamp(raw.scale, MIN_SCALE, MAX_SCALE);

            if (scale <= 1) {
                return { scale: 1, x: 0, y: 0 };
            }

            const pan = clampPan(scale, raw.x ?? prev.x, raw.y ?? prev.y, width, height);

            return { scale, x: pan.x, y: pan.y };
        });
    }, []);

    const toggleDoubleTapZoom = useCallback(() => {
        setZoom((prev) => {
            if (prev.scale > 1.01) {
                return { scale: 1, x: 0, y: 0 };
            }

            return { scale: DOUBLE_TAP_ZOOM, x: 0, y: 0 };
        });
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen || !previewSrc) {
            setIsImageReady(false);
            return undefined;
        }

        resetZoom();
        setIsImageReady(false);

        let cancelled = false;
        const loader = new Image();
        loader.decoding = 'async';
        loader.src = previewSrc;
        if (loader.complete) {
            setIsImageReady(true);
        }
        loader.onload = () => {
            if (!cancelled) {
                setIsImageReady(true);
            }
        };
        loader.onerror = () => {
            if (!cancelled) {
                setIsImageReady(true);
            }
        };

        return () => {
            cancelled = true;
        };
    }, [isOpen, previewSrc, resetZoom]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const neighbors = [
            (index - 1 + images.length) % images.length,
            (index + 1) % images.length,
        ];

        neighbors.forEach((neighborIndex) => {
            const src = resolvePreviewSrc(images[neighborIndex]);
            if (!src) {
                return;
            }

            const img = new Image();
            img.decoding = 'async';
            img.src = src;
        });
    }, [images, index, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        scrollLockY.current = window.scrollY;
        const { style: bodyStyle } = document.body;
        const { style: htmlStyle } = document.documentElement;

        const previous = {
            bodyPosition: bodyStyle.position,
            bodyTop: bodyStyle.top,
            bodyWidth: bodyStyle.width,
            bodyOverflow: bodyStyle.overflow,
            htmlOverflow: htmlStyle.overflow,
        };

        bodyStyle.position = 'fixed';
        bodyStyle.top = `-${scrollLockY.current}px`;
        bodyStyle.width = '100%';
        bodyStyle.overflow = 'hidden';
        htmlStyle.overflow = 'hidden';

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (isZoomed) {
                    resetZoom();
                    return;
                }

                onClose();
            } else if (!isZoomed && event.key === 'ArrowLeft') {
                showPrevious();
            } else if (!isZoomed && event.key === 'ArrowRight') {
                showNext();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);

            bodyStyle.position = previous.bodyPosition;
            bodyStyle.top = previous.bodyTop;
            bodyStyle.width = previous.bodyWidth;
            bodyStyle.overflow = previous.bodyOverflow;
            htmlStyle.overflow = previous.htmlOverflow;

            window.scrollTo(0, scrollLockY.current);
        };
    }, [isOpen, isZoomed, onClose, resetZoom, showNext, showPrevious]);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!isOpen || !viewport) {
            return undefined;
        }

        const onWheel = (event) => {
            event.preventDefault();
            event.stopPropagation();

            const delta = -event.deltaY * 0.0025;
            applyZoom((prev) => ({
                scale: prev.scale + delta,
                x: prev.x,
                y: prev.y,
            }));
        };

        viewport.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            viewport.removeEventListener('wheel', onWheel);
        };
    }, [applyZoom, isOpen]);

    const onTouchStart = (event) => {
        const touches = event.touches;

        if (touches.length === 2) {
            setIsGesturing(true);
            gestureRef.current.mode = 'pinch';
            gestureRef.current.pinchStartDistance = touchDistance(touches);
            gestureRef.current.pinchStartScale = zoom.scale;
            gestureRef.current.swipeStartX = null;
            return;
        }

        if (touches.length !== 1) {
            return;
        }

        const touch = touches[0];

        if (isZoomed) {
            setIsGesturing(true);
            gestureRef.current.mode = 'pan';
            gestureRef.current.panStartX = touch.clientX;
            gestureRef.current.panStartY = touch.clientY;
            gestureRef.current.panOriginX = zoom.x;
            gestureRef.current.panOriginY = zoom.y;
            gestureRef.current.swipeStartX = null;
            return;
        }

        gestureRef.current.mode = 'swipe';
        gestureRef.current.swipeStartX = touch.clientX;
    };

    const onTouchMove = (event) => {
        const touches = event.touches;
        const gesture = gestureRef.current;

        if (gesture.mode === 'pinch' && touches.length === 2) {
            event.preventDefault();

            const distance = touchDistance(touches);
            if (gesture.pinchStartDistance <= 0) {
                return;
            }

            const nextScale = gesture.pinchStartScale * (distance / gesture.pinchStartDistance);
            applyZoom((prev) => ({
                scale: nextScale,
                x: prev.x,
                y: prev.y,
            }));
            return;
        }

        if (gesture.mode === 'pan' && touches.length === 1) {
            event.preventDefault();

            const touch = touches[0];
            const deltaX = touch.clientX - gesture.panStartX;
            const deltaY = touch.clientY - gesture.panStartY;
            applyZoom((prev) => ({
                scale: prev.scale,
                x: gesture.panOriginX + deltaX,
                y: gesture.panOriginY + deltaY,
            }));
        }
    };

    const onTouchEnd = (event) => {
        const gesture = gestureRef.current;

        if (gesture.mode === 'pinch' || gesture.mode === 'pan') {
            if (event.touches.length === 0) {
                gesture.mode = null;
                setIsGesturing(false);

                setZoom((prev) => (prev.scale < 1.05 ? { scale: 1, x: 0, y: 0 } : prev));
            }

            return;
        }

        if (gesture.mode !== 'swipe' || gesture.swipeStartX === null) {
            return;
        }

        const touch = event.changedTouches[0];
        const now = Date.now();
        const deltaX = touch.clientX - gesture.swipeStartX;
        gesture.swipeStartX = null;
        gesture.mode = null;

        if (now - lastTapRef.current < DOUBLE_TAP_MS && Math.abs(deltaX) < 12) {
            lastTapRef.current = 0;
            toggleDoubleTapZoom();
            return;
        }

        lastTapRef.current = now;

        if (images.length < 2 || Math.abs(deltaX) < SWIPE_THRESHOLD) {
            return;
        }

        if (deltaX < 0) {
            showNext();
        } else {
            showPrevious();
        }
    };

    if (!isMounted || !isOpen || !current || !previewSrc) {
        return null;
    }

    const hasMultiple = images.length > 1;
    const controlClass =
        'flex items-center justify-center rounded-full border border-[rgba(243,243,240,0.22)] bg-[rgba(27,28,26,0.62)] text-[rgb(243,243,240)] backdrop-blur-sm transition active:scale-95 active:bg-[rgba(27,28,26,0.85)] touch-manipulation';

    const stopClose = (event) => {
        event.stopPropagation();
    };

    const handleNavClick = (event, action) => {
        event.stopPropagation();
        resetZoom();
        action();
    };

    const zoomHint = locale === 'id' ? 'Cubit / ketuk 2x untuk zoom' : 'Pinch / double-tap to zoom';
    const swipeHint = locale === 'id' ? 'Geser untuk ganti foto' : 'Swipe to change photo';

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex flex-col overscroll-none bg-[rgba(12,12,11,0.96)] backdrop-blur-md"
            style={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            onClick={onClose}
        >
            <div className="flex h-11 shrink-0 items-center justify-end px-3 sm:h-16 sm:px-8">
                <button
                    type="button"
                    className={`${controlClass} h-10 w-10 text-2xl leading-none sm:h-11 sm:w-11`}
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                    aria-label="Close image"
                >
                    ×
                </button>
            </div>

            <div className="relative mx-auto flex min-h-0 w-full max-w-[min(100vw,1400px)] flex-1 items-center justify-center px-1 sm:px-20">
                {hasMultiple && !isZoomed ? (
                    <button
                        type="button"
                        className={`${controlClass} absolute left-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 text-xl sm:left-6 sm:flex`}
                        onClick={(event) => handleNavClick(event, showPrevious)}
                        aria-label="Previous image"
                    >
                        ←
                    </button>
                ) : null}

                <div
                    ref={viewportRef}
                    className="flex h-full w-full touch-none items-center justify-center overflow-hidden"
                    onClick={stopClose}
                    onDoubleClick={(event) => {
                        event.stopPropagation();
                        toggleDoubleTapZoom();
                    }}
                    onTouchStart={(event) => {
                        event.stopPropagation();
                        onTouchStart(event);
                    }}
                    onTouchMove={(event) => {
                        event.stopPropagation();
                        onTouchMove(event);
                    }}
                    onTouchEnd={(event) => {
                        event.stopPropagation();
                        onTouchEnd(event);
                    }}
                >
                    {!isImageReady ? (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="pointer-events-auto h-9 w-9 animate-spin rounded-full border-2 border-[rgba(243,243,240,0.2)] border-t-[rgba(243,243,240,0.85)]" />
                        </div>
                    ) : null}

                    <img
                        src={previewSrc}
                        alt={current.label}
                        draggable={false}
                        decoding="async"
                        className={`max-h-[min(86dvh,92vh)] max-w-full select-none object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)] will-change-transform sm:max-h-[min(72vh,780px)] ${
                            isImageReady ? 'opacity-100' : 'opacity-0'
                        } ${isGesturing ? '' : 'transition-transform duration-200 ease-out'}`}
                        style={{
                            transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})`,
                        }}
                    />
                </div>

                {hasMultiple && !isZoomed ? (
                    <button
                        type="button"
                        className={`${controlClass} absolute right-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 text-xl sm:right-6 sm:flex`}
                        onClick={(event) => handleNavClick(event, showNext)}
                        aria-label="Next image"
                    >
                        →
                    </button>
                ) : null}
            </div>

            <div className="shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 text-center sm:px-4 sm:pb-5">
                <p
                    id={labelId}
                    className="mx-auto mb-2 max-w-2xl px-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-[rgba(243,243,240,0.7)] sm:mb-1 sm:text-[11px]"
                >
                    {current.label}
                    {hasMultiple ? (
                        <span className="hidden sm:inline">{` · ${index + 1} / ${images.length}`}</span>
                    ) : null}
                </p>

                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.08em] text-[rgba(243,243,240,0.4)] sm:mb-2">
                    {isZoomed
                        ? locale === 'id'
                            ? 'Geser untuk geser foto · Esc untuk reset zoom'
                            : 'Drag to pan · Esc to reset zoom'
                        : `${zoomHint}${hasMultiple ? ` · ${swipeHint}` : ''}`}
                </p>

                {isZoomed ? (
                    <button
                        type="button"
                        className={`${controlClass} mx-auto mb-2 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.08em] sm:hidden`}
                        onClick={(event) => {
                            event.stopPropagation();
                            resetZoom();
                        }}
                    >
                        {locale === 'id' ? 'Reset zoom' : 'Reset zoom'}
                    </button>
                ) : null}

                {hasMultiple && !isZoomed ? (
                    <div className="flex items-center justify-between gap-3 sm:hidden">
                        <button
                            type="button"
                            className={`${controlClass} h-12 w-12 shrink-0 text-lg`}
                            onClick={(event) => handleNavClick(event, showPrevious)}
                            aria-label="Previous image"
                        >
                            ←
                        </button>
                        <div className="min-w-0 flex-1 text-center">
                            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[rgba(243,243,240,0.75)]">
                                {index + 1} / {images.length}
                            </span>
                        </div>
                        <button
                            type="button"
                            className={`${controlClass} h-12 w-12 shrink-0 text-lg`}
                            onClick={(event) => handleNavClick(event, showNext)}
                            aria-label="Next image"
                        >
                            →
                        </button>
                    </div>
                ) : null}
            </div>
        </div>,
        document.body,
    );
}
