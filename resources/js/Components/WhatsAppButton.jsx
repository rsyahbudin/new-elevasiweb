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
