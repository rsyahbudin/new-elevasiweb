export default function ProcessSteps({ steps, className = '' }) {
    if (!steps?.length) {
        return null;
    }

    return (
        <ol className={`divide-y divide-[rgba(27,28,26,0.12)] ${className}`}>
            {steps.map((step, i) => (
                <li
                    key={step.step}
                    className="grid grid-cols-[minmax(56px,88px)_1fr] gap-5 py-9 md:grid-cols-[minmax(96px,140px)_1fr] md:gap-10 md:py-12"
                    data-reveal={i * 70}
                >
                    <div
                        aria-hidden="true"
                        className="pt-1 font-mono text-[clamp(36px,6vw,72px)] font-semibold leading-none tracking-[-0.05em] text-[rgba(27,28,26,0.12)]"
                    >
                        {step.step}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-[clamp(22px,3.2vw,38px)] font-semibold uppercase leading-[1.05] tracking-[-0.025em] [text-wrap:balance]">
                            {step.title}
                        </h3>
                        <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-[rgba(27,28,26,0.62)] md:text-[16px]">
                            {step.description}
                        </p>
                    </div>
                </li>
            ))}
        </ol>
    );
}
