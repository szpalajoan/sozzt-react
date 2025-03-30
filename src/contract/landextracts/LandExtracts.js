import React, { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SnackbarAlert from '../../components/SnackbarAlert';
import LandExtractsPersonStep from './components/LandExtractsPersonStep';
import CompleteStepButton from '../../components/CompleteStepButton';
import Remarks from '../../components/remarks/Remarks';
import { useLandExtracts } from './hooks/useLandExtracts';
import { useLandExtractsPerson } from './hooks/useLandExtractsPerson';
import useFetch from "../../useFetch";

const LandExtracts = ({ contractId, onRemarkChange }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: contract } = useFetch(`contracts/${contractId}`);

    const {
        landExtracts,
        setLandExtracts,
        loading,
        isPending,
        snackbar,
        setSnackbar,
        requestForLandExtractsSent,
        completeLandExtracts,
        fetchData,
        refetch
    } = useLandExtracts(contractId);

    const [showCompleteButton, setShowCompleteButton] = useState(false);

    const handleSuccess = (message) => setSnackbar({ open: true, message, severity: 'success' });
    const handleError = (message) => setSnackbar({ open: true, message, severity: 'error' });

    const landExtractsPerson = useLandExtractsPerson(
        landExtracts,
        setLandExtracts,
        contractId,
        fetchData,
        handleSuccess,
        handleError
    );

    const handleRequestSent = async () => {
        const success = await requestForLandExtractsSent();
        if (success) {
            setShowCompleteButton(true);
        }
    };

    const handleComplete = async () => {
        const success = await completeLandExtracts();
        if (success) {
            navigate(0); // Odświeżenie strony
        }
    };

    if (isPending) return <CircularProgress />;
    if (!landExtracts) return <Typography>{t('loading')}</Typography>;

    return (
        <Box className="step-container">
            <LandExtractsPersonStep
                personResponsible={landExtractsPerson.personResponsible}
                availablePersons={landExtractsPerson.availablePersons}
                isEditingPerson={landExtractsPerson.isEditingPerson}
                onPersonEdit={() => landExtractsPerson.setIsEditingPerson(true)}
                setPersonResponsible={landExtractsPerson.setPersonResponsible}
                handlePersonResponsibleChange={landExtractsPerson.handlePersonResponsibleChange}
                requestForPlotExtractsSent={landExtracts.requestForPlotExtractsSent}
                onRequestSent={handleRequestSent}
            />

            {landExtracts.requestForPlotExtractsSent && !landExtracts.completed && (
              
                    <CompleteStepButton
                        handleComplete={handleComplete}
                        loading={loading}
                        titleKey="landExtracts.completeButton.title"
                        descriptionKey="landExtracts.completeButton.allActionsCompleted"
                        warningMessage="landExtracts.completeButton.warning"
                    />
        
            )}

            <Remarks
                stepId="LAND_EXTRACTS"
                contractId={contractId}
                onRemarkChange={onRemarkChange}
            />

            <SnackbarAlert
                open={snackbar.open}
                handleClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Box>
    );
};

export default LandExtracts; 