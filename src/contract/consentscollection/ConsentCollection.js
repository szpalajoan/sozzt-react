import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PrivateConsents from './components/PrivateConsents';
import PublicConsents from './components/PublicConsents';
import { useConsents } from './hooks/useConsents';
import useFetch from '../../useFetch';

const ConsentsCollection = ({ contractId }) => {
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
        uploadConsentFile
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label={t('consentsCollection.privateConsents')} />
                <Tab label={t('consentsCollection.publicConsents')} />
            </Tabs>

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

