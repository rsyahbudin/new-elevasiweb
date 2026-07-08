import { trackEvent } from '../lib/analytics';
import { useWhatsAppInquiry } from '../contexts/WhatsAppInquiryContext';

export default function WhatsAppButton({
    children,
    className = '',
    source,
    showArrow = true,
    disabled = false,
    onClick,
    ...props
}) {
    const { openDialog } = useWhatsAppInquiry();

    return (
        <button
            type="button"
            className={className}
            disabled={disabled}
            onClick={(event) => {
                trackEvent('whatsapp_click', {
                    event_category: 'engagement',
                    event_label: source || 'unknown',
                });
                openDialog(source);
                onClick?.(event);
            }}
            {...props}
        >
            {children}
            {showArrow ? ' ↗' : null}
        </button>
    );
}
