import { useEffect, useId, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { trackEvent } from '../lib/analytics';

export default function WhatsAppInquiryDialog({ open, onClose, sourcePage, copy }) {
    const titleId = useId();
    const descriptionId = useId();
    const firstFieldRef = useRef(null);
    const panelRef = useRef(null);
    const { url } = usePage().props;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        contact: '',
        message: '',
        company: '',
        source_page: sourcePage || url || '/',
    });

    useEffect(() => {
        setData('source_page', sourcePage || url || '/');
    }, [sourcePage, url, setData]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const isDesktop = window.matchMedia('(min-width: 640px)').matches;
        const timer = window.setTimeout(() => {
            if (isDesktop) {
                firstFieldRef.current?.focus();
            }
        }, 80);

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.clearTimeout(timer);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [open, onClose]);

    const handleClose = () => {
        clearErrors();
        reset();
        onClose();
    };

    const submit = (event) => {
        event.preventDefault();

        post(route('kontak.store'), {
            preserveScroll: true,
            onSuccess: () => {
                trackEvent('generate_lead', {
                    event_category: 'conversion',
                    event_label: sourcePage || url || '/',
                });
                reset();
                onClose();
            },
        });
    };

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
            <button
                type="button"
                className="absolute inset-0 bg-[rgba(27,28,26,0.6)] backdrop-blur-[2px] sm:backdrop-blur-sm"
                aria-label={copy.cancel}
                onClick={handleClose}
            />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="relative z-10 flex max-h-[min(92dvh,760px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[20px] border border-b-0 border-[rgba(27,28,26,0.1)] bg-[rgb(243,243,240)] shadow-[0_-12px_48px_rgba(27,28,26,0.18)] sm:max-h-[min(88vh,760px)] sm:rounded-sm sm:border-b sm:shadow-[0_24px_80px_rgba(27,28,26,0.18)]"
            >
                <div className="flex shrink-0 items-center justify-center pt-3 sm:hidden">
                    <span className="h-1 w-10 rounded-full bg-[rgba(27,28,26,0.14)]" aria-hidden="true" />
                </div>

                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[rgba(27,28,26,0.08)] px-5 pb-4 pt-2 sm:px-8 sm:pb-5 sm:pt-6">
                    <div className="min-w-0 flex-1">
                        <span className="mono-label">( WhatsApp )</span>
                        <h2
                            id={titleId}
                            className="m-0 mt-2 text-[clamp(22px,5.5vw,32px)] font-semibold uppercase leading-[1.05] tracking-[-0.02em] [text-wrap:balance]"
                        >
                            {copy.title}
                        </h2>
                        <p id={descriptionId} className="mt-2 text-[15px] leading-[1.6] text-[rgba(27,28,26,0.62)] sm:mt-3 sm:text-[15px]">
                            {copy.description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(27,28,26,0.12)] bg-white text-xl leading-none text-[rgba(27,28,26,0.55)] transition hover:border-[rgba(27,28,26,0.2)] hover:text-[rgb(27,28,26)]"
                        aria-label={copy.cancel}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-8 sm:py-5">
                        <input
                            type="text"
                            name="company"
                            value={data.company}
                            onChange={(event) => setData('company', event.target.value)}
                            className="hidden"
                            tabIndex={-1}
                            autoComplete="off"
                        />

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="inquiry-name"
                                    className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.5)]"
                                >
                                    {copy.nameLabel}
                                </label>
                                <input
                                    ref={firstFieldRef}
                                    id="inquiry-name"
                                    type="text"
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    className="w-full rounded-sm border border-[rgba(27,28,26,0.15)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[rgb(31,122,70)]"
                                    autoComplete="name"
                                    required
                                />
                                {errors.name && <p className="mt-1.5 text-sm text-red-700">{errors.name}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="inquiry-contact"
                                    className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.5)]"
                                >
                                    {copy.contactLabel}
                                </label>
                                <input
                                    id="inquiry-contact"
                                    type="tel"
                                    value={data.contact}
                                    onChange={(event) => setData('contact', event.target.value)}
                                    className="w-full rounded-sm border border-[rgba(27,28,26,0.15)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[rgb(31,122,70)]"
                                    autoComplete="tel"
                                    inputMode="tel"
                                    placeholder={copy.contactPlaceholder}
                                    required
                                />
                                {errors.contact && <p className="mt-1.5 text-sm text-red-700">{errors.contact}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="inquiry-message"
                                    className="mb-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(27,28,26,0.5)]"
                                >
                                    {copy.messageLabel}
                                </label>
                                <textarea
                                    id="inquiry-message"
                                    value={data.message}
                                    onChange={(event) => setData('message', event.target.value)}
                                    rows={4}
                                    className="min-h-[112px] w-full resize-y rounded-sm border border-[rgba(27,28,26,0.15)] bg-white px-4 py-3.5 text-base leading-[1.6] outline-none transition focus:border-[rgb(31,122,70)]"
                                    placeholder={copy.messagePlaceholder}
                                    required
                                />
                                {errors.message && <p className="mt-1.5 text-sm text-red-700">{errors.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-[rgba(27,28,26,0.08)] bg-[rgb(243,243,240)] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-5">
                        <div className="flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
                            <button
                                type="submit"
                                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[rgb(31,122,70)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition hover:bg-[rgb(27,28,26)] disabled:opacity-60 sm:w-auto"
                                disabled={processing}
                            >
                                {processing ? copy.submitting : `${copy.submit} ↗`}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[rgba(27,28,26,0.2)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] transition hover:bg-[rgb(236,236,232)] sm:w-auto"
                                disabled={processing}
                            >
                                {copy.cancel}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
