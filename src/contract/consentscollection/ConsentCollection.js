import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PrivateConsents from './components/PrivateConsents';
import PublicConsents from './components/PublicConsents';
import { useConsents } from './hooks/useConsents';
import useFetch from '../../useFetch';
import { Check as CheckIcon } from '@mui/icons-material';

const ConsentsCollection = ({ contractId, refetchContract }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const { 
        consents, 
        publicConsents, 
        fetchConsents,
        addPrivateConsent,
        addPublicConsent,
        updateConsentStatus,
        updatePublicConsentStatus,
        invalidateConsent,
        invalidatePublicConsent,
        approveConsent,
        uploadConsentFile,
        completeConsentsCollection
    } = useConsents(contractId);

    const { data: fetchedFiles, refetch: refetchFiles } = useFetch(
        `contracts/${contractId}/files?fileType=PRIVATE_PLOT_OWNER_CONSENT_AGREEMENT`
    );
    const { data: publicFetchedFiles, refetch: refetchPublicFiles } = useFetch(
        `contracts/${contractId}/files?fileType=PUBLIC_OWNER_CONSENT_AGREEMENT`
    );

    useEffect(() => {
        fetchConsents();
    }, [contractId]);

    const canComplete = () => {
        if (consents?.completed) {
            return false;
        }
        
        const allPrivateConsentsApproved = consents?.every(
            consent => consent.consentStatus === 'CONSENT_GIVEN'
        );
        const allPublicConsentsApproved = publicConsents?.every(
            consent => consent.consentStatus === 'CONSENT_GIVEN'
        );
        return allPrivateConsentsApproved && allPublicConsentsApproved;
    };


    const handleComplete = async () => {
        try {
            await completeConsentsCollection();
            if (refetchContract) {
                refetchContract();
            }
        } catch (error) {
            console.error('Error completing consents collection:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
            }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label={t('consentsCollection.privateConsents')} />
                    <Tab label={t('consentsCollection.publicConsents')} />
                </Tabs>
                {canComplete() && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={handleComplete}
                        sx={{ ml: 2 }}
                    >
                        {t('consentsCollection.complete')}
                    </Button>
                )}
            </Box>

            {activeTab === 0 && (
                <PrivateConsents
                    contractId={contractId}
                    consents={consents}
                    fetchedFiles={fetchedFiles}
                    onAddConsent={addPrivateConsent}
                    onUpdateStatus={updateConsentStatus}
                    onInvalidate={invalidateConsent}
                    onApprove={approveConsent}
                    onUploadFile={uploadConsentFile}
                    refetchFiles={refetchFiles}
                    fetchConsents={fetchConsents}
                />
            )}

            {activeTab === 1 && (
                <PublicConsents
                    contractId={contractId}
                    consents={publicConsents}
                    fetchedFiles={publicFetchedFiles}
                    onAddConsent={addPublicConsent}
                    onUpdateStatus={updatePublicConsentStatus}
                    onInvalidate={invalidatePublicConsent}
                    onApprove={(id, data) => approveConsent(id, data, 'public')}
                    onUploadFile={(id, file) => uploadConsentFile(id, file, 'public')}
                    refetchFiles={refetchPublicFiles}
                    fetchConsents={fetchConsents}
                />
            )}
        </Box>
    );
};

export default ConsentsCollection;

