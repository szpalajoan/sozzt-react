import React, { useState } from 'react';
import { Box, List, Snackbar, Alert } from '@mui/material';
import ConsentItem from './ConsentItem';
import ConsentDialog from './ConsentDialog';
import { useTranslation } from 'react-i18next';
import PublicConsentForm from './PublicConsentForm';
import PublicApproveDialog from './PublicApproveDialog';

const PublicConsents = ({
    contractId,
    consents,
    fetchedFiles,
    onAddConsent,
    onUpdateStatus,
    onInvalidate,
    onApprove,
    refetchFiles,
    fetchConsents,
    onUploadFile
}) => {
    const { t } = useTranslation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [currentConsent, setCurrentConsent] = useState(null);
    const [actionType, setActionType] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleStatusChange = async (newStatus, comment) => {
        if (newStatus === 'INVALIDATED') {
            await onInvalidate(currentConsent.publicPlotOwnerConsentId, comment);
        } else {
            await onUpdateStatus(currentConsent.publicPlotOwnerConsentId, newStatus, comment);
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

    const handleApproveComplete = async () => {
        try {
            await fetchConsents();
            await refetchFiles();
            setApproveDialogOpen(false);
            setSnackbarMessage(t('consentsCollection.approveSuccess'));
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error after approving consent:', error);
            setSnackbarMessage(t('consentsCollection.approveError'));
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box>
            <Box className="main-content">
                <h2 className="section-title">Public Consents</h2>
                <PublicConsentForm onSubmit={onAddConsent} />
            </Box>

            <List sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0,
                '& .MuiListItem-root': {
                    marginBottom: 1
                },
                '& .MuiListItem-root:last-child': {
                    marginBottom: 0
                }
            }}>
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

            <PublicApproveDialog
                open={approveDialogOpen}
                consent={currentConsent}
                onClose={() => setApproveDialogOpen(false)}
                onApprove={onApprove}
                onUploadFile={onUploadFile}
                onComplete={handleApproveComplete}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PublicConsents; 