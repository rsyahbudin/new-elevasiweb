import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import WhatsAppInquiryDialog from '../Components/WhatsAppInquiryDialog';

const WhatsAppInquiryContext = createContext(null);

export function WhatsAppInquiryProvider({ children, copy, onOpen }) {
    const [isOpen, setIsOpen] = useState(false);
    const [sourcePage, setSourcePage] = useState('');

    const openDialog = useCallback(
        (source = '') => {
            onOpen?.();
            setSourcePage(source || window.location.pathname);
            setIsOpen(true);
        },
        [onOpen],
    );

    const closeDialog = useCallback(() => {
        setIsOpen(false);
    }, []);

    const value = useMemo(() => ({ openDialog }), [openDialog]);

    return (
        <WhatsAppInquiryContext.Provider value={value}>
            {children}
            <WhatsAppInquiryDialog
                open={isOpen}
                onClose={closeDialog}
                sourcePage={sourcePage}
                copy={copy}
            />
        </WhatsAppInquiryContext.Provider>
    );
}

export function useWhatsAppInquiry() {
    const context = useContext(WhatsAppInquiryContext);

    if (!context) {
        throw new Error('useWhatsAppInquiry must be used within WhatsAppInquiryProvider');
    }

    return context;
}
