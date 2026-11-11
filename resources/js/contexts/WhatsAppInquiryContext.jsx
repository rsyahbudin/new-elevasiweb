import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import WhatsAppInquiryDialog from '../Components/WhatsAppInquiryDialog';

const WhatsAppInquiryContext = createContext(null);

export function WhatsAppInquiryProvider({ children, copy, onOpen }) {
    const [isOpen, setIsOpen] = useState(false);
    const [sourcePage, setSourcePage] = useState('');
    const [preferredPerson, setPreferredPerson] = useState(null);

    const openDialog = useCallback(
        (source = '', contactPerson = null) => {
            onOpen?.();
            setSourcePage(source || window.location.pathname);
            setPreferredPerson(contactPerson);
            setIsOpen(true);
        },
        [onOpen],
    );

    const closeDialog = useCallback(() => {
        setIsOpen(false);
        setPreferredPerson(null);
    }, []);

    const value = useMemo(() => ({ openDialog }), [openDialog]);

    return (
        <WhatsAppInquiryContext.Provider value={value}>
            {children}
            <WhatsAppInquiryDialog
                open={isOpen}
                onClose={closeDialog}
                sourcePage={sourcePage}
                preferredPerson={preferredPerson}
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
