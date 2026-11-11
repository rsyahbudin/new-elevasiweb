import { useEffect, useId, useRef, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { loadGsap, prefersReducedMotion } from '../lib/gsap';
import { trackEvent } from '../lib/analytics';

const fieldClass =
    'w-full rounded-xl border border-[rgba(27,28,26,0.1)] bg-[rgba(255,255,255,0.88)] px-4 py-3.5 text-base outline-none transition-[border-color,box-shadow,background-color] duration-300 focus:border-[rgb(31,122,70)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(31,122,70,0.12)]';

export default function WhatsAppInquiryDialog({ open, onClose, sourcePage, preferredPerson = null, copy }) {
    const titleId = useId();
    const descriptionId = useId();
    const firstFieldRef = useRef(null);
    const backdropRef = useRef(null);
    const panelRef = useRef(null);
    const rootRef = useRef(null);
    const { url, locale } = usePage().props;
    const contactPersons = copy?.contactPersons ?? [];
    const purposeOptions = copy?.purposeOptions ?? [];
    const referralOptions = copy?.referralOptions ?? [];
    const defaultPersonIndex = contactPersons[0]?.index ?? 0;
    const [isRendered, setIsRendered] = useState(open);
    const isId = locale === 'id';

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        contact: '',
        message: '',
        company: '',
        contact_person: defaultPersonIndex,
        inquiry_purpose: '',
        inquiry_purpose_detail: '',
        referral_source: '',
        referral_detail: '',
        source_page: sourcePage || url || '/',
    });

    const selectedPurpose = purposeOptions.find((option) => option.key === data.inquiry_purpose);
    const showPurposeDetail = Boolean(selectedPurpose?.requires_detail);
    const purposeDetailLabel =
        selectedPurpose?.detail_label
        || copy.purposeDetailLabel
        || (isId ? 'Jelaskan tujuan Anda' : 'Tell us more about your goal');
    const purposeDetailPlaceholder =
        selectedPurpose?.detail_placeholder || copy.purposeDetailPlaceholder || '';
    const purposeLabel =
        copy.purposeLabel || (isId ? 'Tujuan chat' : 'What can we help with?');
    const purposePlaceholder =
        copy.purposePlaceholder || (isId ? 'Pilih tujuan' : 'Select a purpose');

    const selectedReferral = referralOptions.find((option) => option.key === data.referral_source);
    const showReferralDetail = Boolean(selectedReferral?.requires_detail);
    const referralDetailLabel =
        selectedReferral?.detail_label
        || copy.referralDetailLabel
        || (isId ? 'Ceritakan lebih detail' : 'Tell us more');
    const referralDetailPlaceholder =
        selectedReferral?.detail_placeholder || copy.referralDetailPlaceholder || '';
    const referralLabel =
        copy.referralLabel || (isId ? 'Tahu kami dari mana?' : 'How did you hear about us?');
    const referralPlaceholder =
        copy.referralPlaceholder || (isId ? 'Pilih salah satu' : 'Select one');

    useEffect(() => {
        if (open) {
            setIsRendered(true);
        }
    }, [open]);

    useEffect(() => {
        setData('source_page', sourcePage || url || '/');
    }, [sourcePage, url, setData]);

    useEffect(() => {
        if (!open || contactPersons.length === 0) {
            return;
        }

        const preferred =
            preferredPerson !== null && preferredPerson !== undefined
                ? contactPersons.find((person) => person.index === preferredPerson)
                : null;

        setData('contact_person', preferred?.index ?? contactPersons[0].index);
    }, [open, preferredPerson, contactPersons, setData]);

    useEffect(() => {
        if (!isRendered || !open) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const isDesktop = window.matchMedia('(min-width: 640px)').matches;
        const timer = window.setTimeout(() => {
            if (isDesktop) {
                firstFieldRef.current?.focus();
            }
        }, 520);

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
    }, [open, isRendered, onClose]);

    useEffect(() => {
        if (!isRendered) {
            return undefined;
        }

        if (prefersReducedMotion()) {
            if (!open) {
                setIsRendered(false);
            }
            return undefined;
        }

        let cancelled = false;
        let ctx;

        (async () => {
            const gsap = await loadGsap();

            if (cancelled) {
                return;
            }

            const backdrop = backdropRef.current;
            const panel = panelRef.current;
            const root = rootRef.current;
            const isMobile = window.matchMedia('(max-width: 639px)').matches;

            if (!backdrop || !panel || !root) {
                return;
            }

            const parts = root.querySelectorAll('[data-dialog-part]');

            if (open) {
                gsap.set(backdrop, { autoAlpha: 0 });
                gsap.set(panel, {
                    autoAlpha: 1,
                    yPercent: isMobile ? 100 : 0,
                    y: isMobile ? 0 : 28,
                    scale: isMobile ? 1 : 0.94,
                });
                gsap.set(parts, { y: 18, autoAlpha: 0 });

                ctx = gsap.context(() => {
                    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

                    tl.to(backdrop, { autoAlpha: 1, duration: 0.55, ease: 'power2.out' });

                    if (isMobile) {
                        tl.to(panel, { yPercent: 0, duration: 0.88, ease: 'power4.out' }, '-=0.42');
                    } else {
                        tl.to(
                            panel,
                            { y: 0, scale: 1, autoAlpha: 1, duration: 0.78, ease: 'power4.out' },
                            '-=0.42',
                        );
                    }

                    tl.to(
                        parts,
                        {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.62,
                            stagger: 0.07,
                            ease: 'power3.out',
                        },
                        '-=0.48',
                    );
                }, root);
            } else {
                ctx = gsap.context(() => {
                    const onDone = () => {
                        if (!cancelled) {
                            setIsRendered(false);
                        }
                    };

                    if (isMobile) {
                        const tl = gsap.timeline({ onComplete: onDone });
                        tl.to(panel, { yPercent: 100, duration: 0.5, ease: 'power3.in' });
                        tl.to(backdrop, { autoAlpha: 0, duration: 0.32, ease: 'power2.in' }, '-=0.24');
                    } else {
                        gsap.to([backdrop, panel], {
                            autoAlpha: 0,
                            duration: 0.26,
                            ease: 'power2.out',
                            onComplete: onDone,
                        });
                    }
                }, root);
            }
        })();

        return () => {
            cancelled = true;
            ctx?.revert();
        };
    }, [open, isRendered]);

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

    if (!isRendered) {
        return null;
    }

    return (
        <div
            ref={rootRef}
            className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
        >
            <button
                ref={backdropRef}
                type="button"
                className="absolute inset-0 bg-[rgba(27,28,26,0.42)] backdrop-blur-md"
                aria-label={copy.cancel}
                onClick={handleClose}
            />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="relative z-10 flex max-h-[min(92dvh,760px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] border border-[rgba(27,28,26,0.08)] bg-[rgb(243,243,240)] shadow-[0_-20px_60px_rgba(27,28,26,0.16)] sm:max-h-[min(88vh,760px)] sm:rounded-2xl sm:shadow-[0_32px_90px_rgba(27,28,26,0.16)]"
            >
                <div className="flex shrink-0 items-center justify-center pt-3.5 sm:hidden" data-dialog-part>
                    <span className="h-1 w-12 rounded-full bg-[rgba(27,28,26,0.12)]" aria-hidden="true" />
                </div>

                <div
                    data-dialog-part
                    className="flex shrink-0 items-start justify-between gap-4 px-5 pb-5 pt-1 sm:px-8 sm:pb-6 sm:pt-7"
                >
                    <div className="min-w-0 flex-1">
                        <span className="mono-label">( WhatsApp )</span>
                        <h2
                            id={titleId}
                            className="m-0 mt-2.5 text-[clamp(22px,5.5vw,30px)] font-semibold uppercase leading-[1.08] tracking-[-0.02em] [text-wrap:balance]"
                        >
                            {copy.title}
                        </h2>
                        <p
                            id={descriptionId}
                            className="mt-2.5 text-[15px] leading-[1.65] text-[rgba(27,28,26,0.58)] sm:mt-3"
                        >
                            {copy.description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(27,28,26,0.05)] text-lg leading-none text-[rgba(27,28,26,0.45)] transition duration-300 hover:bg-[rgba(27,28,26,0.1)] hover:text-[rgb(27,28,26)]"
                        aria-label={copy.cancel}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-2 sm:px-8 sm:pb-3">
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
                            {contactPersons.length > 1 && (
                                <fieldset data-dialog-part className="m-0 min-w-0 border-0 p-0">
                                    <legend className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]">
                                        {copy.personLabel || 'Contact'}
                                    </legend>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {contactPersons.map((person) => {
                                            const selected = data.contact_person === person.index;

                                            return (
                                                <label
                                                    key={person.index}
                                                    className={`flex cursor-pointer flex-col rounded-xl border px-4 py-3 transition ${
                                                        selected
                                                            ? 'border-[rgb(31,122,70)] bg-[rgba(31,122,70,0.06)] shadow-[0_0_0_3px_rgba(31,122,70,0.12)]'
                                                            : 'border-[rgba(27,28,26,0.1)] bg-[rgba(255,255,255,0.88)] hover:border-[rgba(27,28,26,0.2)]'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="contact_person"
                                                        value={person.index}
                                                        checked={selected}
                                                        onChange={() => setData('contact_person', person.index)}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-sm font-semibold tracking-[-0.01em]">
                                                        {person.name}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {errors.contact_person && (
                                        <p className="mt-1.5 text-sm text-red-700">{errors.contact_person}</p>
                                    )}
                                </fieldset>
                            )}

                            <div data-dialog-part>
                                <label
                                    htmlFor="inquiry-name"
                                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]"
                                >
                                    {copy.nameLabel}
                                </label>
                                <input
                                    ref={firstFieldRef}
                                    id="inquiry-name"
                                    type="text"
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    className={fieldClass}
                                    autoComplete="name"
                                    required
                                />
                                {errors.name && <p className="mt-1.5 text-sm text-red-700">{errors.name}</p>}
                            </div>

                            <div data-dialog-part>
                                <label
                                    htmlFor="inquiry-contact"
                                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]"
                                >
                                    {copy.contactLabel}
                                </label>
                                <input
                                    id="inquiry-contact"
                                    type="tel"
                                    value={data.contact}
                                    onChange={(event) => setData('contact', event.target.value)}
                                    className={fieldClass}
                                    autoComplete="tel"
                                    inputMode="tel"
                                    placeholder={copy.contactPlaceholder}
                                    required
                                />
                                {errors.contact && <p className="mt-1.5 text-sm text-red-700">{errors.contact}</p>}
                            </div>

                            {purposeOptions.length > 0 && (
                                <div data-dialog-part>
                                    <label
                                        htmlFor="inquiry-purpose"
                                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]"
                                    >
                                        {purposeLabel}
                                    </label>
                                    <select
                                        id="inquiry-purpose"
                                        value={data.inquiry_purpose}
                                        onChange={(event) => {
                                            setData('inquiry_purpose', event.target.value);
                                            setData('inquiry_purpose_detail', '');
                                        }}
                                        className={`${fieldClass} appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                                        style={{
                                            backgroundImage:
                                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%231B1C1A' stroke-opacity='0.45' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                                        }}
                                        required
                                    >
                                        <option value="">{purposePlaceholder}</option>
                                        {purposeOptions.map((option) => (
                                            <option key={option.key} value={option.key}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.inquiry_purpose && (
                                        <p className="mt-1.5 text-sm text-red-700">{errors.inquiry_purpose}</p>
                                    )}
                                </div>
                            )}

                            {showPurposeDetail && (
                                <div data-dialog-part>
                                    <label
                                        htmlFor="inquiry-purpose-detail"
                                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]"
                                    >
                                        {purposeDetailLabel}
                                    </label>
                                    <input
                                        id="inquiry-purpose-detail"
                                        type="text"
                                        value={data.inquiry_purpose_detail}
                                        onChange={(event) => setData('inquiry_purpose_detail', event.target.value)}
                                        className={fieldClass}
                                        placeholder={purposeDetailPlaceholder}
                                        required
                                    />
                                    {errors.inquiry_purpose_detail && (
                                        <p className="mt-1.5 text-sm text-red-700">{errors.inquiry_purpose_detail}</p>
                                    )}
                                </div>
                            )}

                            {referralOptions.length > 0 && (
                                <div data-dialog-part>
                                    <label
                                        htmlFor="inquiry-referral"
                                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]"
                                    >
                                        {referralLabel}
                                    </label>
                                    <select
                                        id="inquiry-referral"
                                        value={data.referral_source}
                                        onChange={(event) => {
                                            setData('referral_source', event.target.value);
                                            setData('referral_detail', '');
                                        }}
                                        className={`${fieldClass} appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                                        style={{
                                            backgroundImage:
                                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%231B1C1A' stroke-opacity='0.45' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                                        }}
                                        required
                                    >
                                        <option value="">
                                            {referralPlaceholder}
                                        </option>
                                        {referralOptions.map((option) => (
                                            <option key={option.key} value={option.key}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.referral_source && (
                                        <p className="mt-1.5 text-sm text-red-700">{errors.referral_source}</p>
                                    )}
                                </div>
                            )}

                            {showReferralDetail && (
                                <div data-dialog-part>
                                    <label
                                        htmlFor="inquiry-referral-detail"
                                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]"
                                    >
                                        {referralDetailLabel}
                                    </label>
                                    <input
                                        id="inquiry-referral-detail"
                                        type="text"
                                        value={data.referral_detail}
                                        onChange={(event) => setData('referral_detail', event.target.value)}
                                        className={fieldClass}
                                        placeholder={referralDetailPlaceholder}
                                        required
                                    />
                                    {errors.referral_detail && (
                                        <p className="mt-1.5 text-sm text-red-700">{errors.referral_detail}</p>
                                    )}
                                </div>
                            )}

                            <div data-dialog-part>
                                <label
                                    htmlFor="inquiry-message"
                                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(27,28,26,0.45)]"
                                >
                                    {copy.messageLabel}
                                </label>
                                <textarea
                                    id="inquiry-message"
                                    value={data.message}
                                    onChange={(event) => setData('message', event.target.value)}
                                    rows={4}
                                    className={`${fieldClass} min-h-[112px] resize-y leading-[1.6]`}
                                    placeholder={copy.messagePlaceholder}
                                    required
                                />
                                {errors.message && <p className="mt-1.5 text-sm text-red-700">{errors.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div
                        data-dialog-part
                        className="shrink-0 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-5"
                    >
                        <div className="flex flex-col gap-2.5 sm:flex-row-reverse sm:justify-start">
                            <button
                                type="submit"
                                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[rgb(31,122,70)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-[rgb(243,243,240)] transition duration-300 hover:bg-[rgb(27,28,26)] disabled:opacity-60 sm:w-auto"
                                disabled={processing}
                            >
                                {processing ? copy.submitting : `${copy.submit} ↗`}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[rgba(27,28,26,0.14)] bg-[rgba(255,255,255,0.45)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-[rgba(27,28,26,0.72)] transition duration-300 hover:border-[rgba(27,28,26,0.22)] hover:bg-white sm:w-auto"
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
