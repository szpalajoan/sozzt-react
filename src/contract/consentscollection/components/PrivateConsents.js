import React, { useState } from 'react';
import { Box, List } from '@mui/material';
import ConsentForm from './ConsentForm';
import ConsentItem from './ConsentItem';
import ConsentDialog from './ConsentDialog';
import ApproveDialog from './ApproveDialog';

const PrivateConsents = ({
    contractId,
    consents,
    fetchedFiles,
    onAddConsent,
    onUpdateStatus,
    onInvalidate,
    onApprove,
    onUploadFile,
    refetchFiles
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [currentConsent, setCurrentConsent] = useState(null);
    const [actionType, setActionType] = useState('');

    const handleStatusChange = async (newStatus, comment) => {
        if (newStatus === 'INVALIDATED') {
            await onInvalidate(currentConsent.privatePlotOwnerConsentId, comment);
        } else {
            await onUpdateStatus(currentConsent.privatePlotOwnerConsentId, newStatus, comment);
        }
        setDialogOpen(false);
    };

    const sortConsents = (consents) => {
        return [...consents].sort((a, b) => {
            if (a.consentStatus === 'CONSENT_CREATED' && b.consentStatus !== 'CONSENT_CREATED') return -1;
            if (a.consentStatus !== 'CONSENT_GIVEN' && b.consentStatus === 'CONSENT_GIVEN') return -1;
            return 0;
        });
    };

    return (
        <Box>
            <Box className="main-content">
                <h2 className="section-title">Private Consents</h2>
                <ConsentForm
                    onSubmit={onAddConsent}
                    type="private"
                />
            </Box>

            <List sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {sortConsents(consents).map((consent) => (
                    <ConsentItem
                        key={consent.privatePlotOwnerConsentId}
                        consent={consent}
                        files={fetchedFiles}
                        contractId={contractId}
                        onOpenDialog={(type) => {
                            setCurrentConsent(consent);
                            setActionType(type);
                            setDialogOpen(true);
                        }}
                        onOpenApproveDialog={() => {
                            setCurrentConsent(consent);
                            setApproveDialogOpen(true);
                        }}
                    />
                ))}
            </List>

            <ConsentDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleStatusChange}
                actionType={actionType}
            />

            <ApproveDialog
                open={approveDialogOpen}
                consent={currentConsent}
                onClose={() => setApproveDialogOpen(false)}
                onApprove={onApprove}
                onUploadFile={onUploadFile}
                type="private"
            />
        </Box>
    );
};

export default PrivateConsents; 