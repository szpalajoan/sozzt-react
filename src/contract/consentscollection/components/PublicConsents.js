import React, { useState } from 'react';
import { Box, List } from '@mui/material';
import ConsentForm from './ConsentForm';
import ConsentItem from './ConsentItem';
import ConsentDialog from './ConsentDialog';
import ApproveDialog from './ApproveDialog';

const PublicConsents = ({
    contractId,
    consents,
    fetchedFiles,
    onAddConsent,
    onUpdateStatus,
    onInvalidate,
    onApprove,
    refetchFiles
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [currentConsent, setCurrentConsent] = useState(null);
    const [actionType, setActionType] = useState('');

    const handleStatusChange = async (newStatus, comment) => {
        if (newStatus === 'INVALIDATED') {
            await onInvalidate(currentConsent.publicPlotOwnerConsentId, comment);
        } else {
            await onUpdateStatus(currentConsent.publicPlotOwnerConsentId, newStatus, comment, 'public');
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
                <h2 className="section-title">Public Consents</h2>
                <ConsentForm
                    onSubmit={onAddConsent}
                    type="public"
                />
            </Box>

            <List sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {sortConsents(consents).map((consent) => (
                    <ConsentItem
                        key={consent.publicPlotOwnerConsentId}
                        consent={consent}
                        files={fetchedFiles}
                        contractId={contractId}
                        type="public"
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
                onApprove={(consentId, data) => onApprove(consentId, data, 'public')}
                contractId={contractId}
                refetchFiles={refetchFiles}
                type="public"
            />
        </Box>
    );
};

export default PublicConsents; 