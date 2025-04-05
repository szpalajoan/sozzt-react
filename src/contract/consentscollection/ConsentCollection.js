import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Button, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PrivateConsents from './components/PrivateConsents';
import PublicConsents from './components/PublicConsents';
import ZudConsent from './components/ZudConsent';
import { useConsents } from './hooks/useConsents';
import useFetch from '../../useFetch';
import { Check as CheckIcon } from '@mui/icons-material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './ConsentCollection.css';

const ConsentsCollection = ({ contractId, refetchContract }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const { data: contract, isPending: isContractPending } = useFetch(`contracts/${contractId}`);
    
    const { 
        consents, 
        publicConsents,
        zudConsent,
        fetchConsents,
        beginConsentsCollection,
        addPrivateConsent,
        addPublicConsent,
        updateConsentStatus,
        updatePublicConsentStatus,
        invalidateConsent,
        invalidatePublicConsent,
        approveConsent,
        uploadConsentFile,
        completeConsentsCollection,
        updateZudConsent,
        markZudConsentAsSentByMail,
        addZudConsentAgreement,
        invalidateZudConsent
    } = useConsents(contractId);

    const { data: fetchedFiles, refetch: refetchFiles } = useFetch(
        `contracts/${contractId}/files?fileType=PRIVATE_PLOT_OWNER_CONSENT_AGREEMENT`
    );
    const { data: publicFetchedFiles, refetch: refetchPublicFiles } = useFetch(
        `contracts/${contractId}/files?fileType=PUBLIC_OWNER_CONSENT_AGREEMENT`
    );

    useEffect(() => {
        if (getStepStatus() === 'IN_PROGRESS' || 'DONE') {
            fetchConsents();
        }
    }, [contractId, contract]);

    const getStepStatus = () => {
        if (!contract || !contract.contractSteps) return null;
        
        const consentStep = contract.contractSteps.find(
            step => step.contractStepType === 'CONSENTS_COLLECTION'
        );
        
        return consentStep ? consentStep.contractStepStatus : null;
    };

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
        const zudConsentApproved = zudConsent?.consentStatus === 'CONSENT_GIVEN' || zudConsent === null;
        return allPrivateConsentsApproved && allPublicConsentsApproved && zudConsentApproved;
    };

    const isRoutePreparationCompleted = () => {
        return contract?.contractSteps?.some(
            step => step.contractStepType === 'ROUTE_PREPARATION' && step.contractStepStatus === 'DONE'
        );
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

    const handleBeginCollection = async () => {
        setLoading(true);
        try {
            await beginConsentsCollection();
            window.location.reload();
        } catch (error) {
            console.error('Error beginning consents collection:', error);
            setLoading(false);
        }
    };

    if (isContractPending) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (getStepStatus() === 'ON_HOLD') {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    p: 4,
                    my: 4,
                    border: '1px dashed #ccc',
                    borderRadius: '8px'
                }}
            >
                <Typography variant="h5" align="center">
                    {t('consentsCollection.notStarted')}
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                    {t('consentsCollection.startDescription')}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={handleBeginCollection}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : t('consentsCollection.beginCollection')}
                </Button>
            </Box>
        );
    }

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
                    <Tab label={t('consentsCollection.zudConsent')} />
                </Tabs>
                {!canComplete() ? (
                    <Typography className="status-message">
                        {t('consentsCollection.notAllConsentsApproved')}
                    </Typography>
                ) : !isRoutePreparationCompleted() ? (
                    <Typography className="status-message">
                        {t('consentsCollection.routePreparationRequired')}
                    </Typography>
                ) : (
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

            {activeTab === 2 && (
                <ZudConsent
                    contractId={contractId}
                    zudConsent={zudConsent}
                    onUpdateZudConsent={updateZudConsent}
                    onMarkAsSentByMail={markZudConsentAsSentByMail}
                    onAddAgreement={addZudConsentAgreement}
                    onInvalidate={invalidateZudConsent}
                />
            )}
        </Box>
    );
};

export default ConsentsCollection;

