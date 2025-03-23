import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SnackbarAlert from '../../components/SnackbarAlert';
import MapVerificationStep from './components/MapVerificationStep';
import RouteDrawingStep from './components/RouteDrawingStep';
import CompleteStepButton from '../../components/CompleteStepButton';
import Remarks from '../../components/remarks/Remarks';
import { useRoutePreparation } from './hooks/useRoutePreparation';
import { useRouteDrawingPerson } from './hooks/useRouteDrawingPerson';
import { useRouteFiles } from './hooks/useRouteFiles';
import useFetch from "../../useFetch";

const RoutePreparation = ({ contractId, onRemarkChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: contract } = useFetch(`contracts/${contractId}`);

  const {
    routePreparation,
    setRoutePreparation,
    loading,
    isPending,
    snackbar,
    setSnackbar,
    approveMap,
    completeRoutePreparation,
    fetchData,
    refetch
  } = useRoutePreparation(contractId);

  const [showCompleteButton, setShowCompleteButton] = useState(false);

  const handleSuccess = (message) => setSnackbar({ open: true, message, severity: 'success' });
  const handleError = (message) => setSnackbar({ open: true, message, severity: 'error' });

  const routeDrawingPerson = useRouteDrawingPerson(
    routePreparation,
    setRoutePreparation,
    contractId,
    fetchData,
    handleSuccess,
    handleError
  );

  const drawnRouteFiles = useRouteFiles(
    routePreparation,
    setRoutePreparation,
    contractId,
    fetchData,
    handleSuccess,
    handleError,
    'drawnRoute',
    refetch
  );

  const pdfWithRouteFiles = useRouteFiles(
    routePreparation,
    setRoutePreparation,
    contractId,
    fetchData,
    handleSuccess,
    handleError,
    'pdfWithRoute',
    refetch
  );

  useEffect(() => {
    if (routePreparation && contract) {
      const hasMapWithRoute = !!routePreparation.routeDrawing?.mapWithRouteFileId;
      const hasRouteWithData = !!routePreparation.routeDrawing?.routeWithDataFileId;
      const isStepCompleted = contract.contractSteps?.find(step => step.contractStepType === "ROUTE_PREPARATION")?.contractStepStatus === "DONE";

      setShowCompleteButton(
        routePreparation.mapVerification?.correctnessOfTheMap && 
        hasMapWithRoute && 
        hasRouteWithData && 
        !isStepCompleted
      );
    }
  }, [routePreparation, contract]);

  const handleComplete = async () => {
    const success = await completeRoutePreparation();
    if (success) {
      navigate(0); // Odświeżenie strony
    }
  };

  if (isPending) return <CircularProgress />;
  if (!routePreparation) return <Typography>{t('loading')}</Typography>;

  return (
    <Box className="step-container">
      <MapVerificationStep 
        routePreparation={routePreparation}
        onApprove={approveMap}
        loading={loading}
      />

      <RouteDrawingStep 
        routePreparation={routePreparation}
        personResponsible={routeDrawingPerson.personResponsible}
        availablePersons={routeDrawingPerson.availablePersons}
        isEditingPerson={routeDrawingPerson.isEditingPerson}
        onPersonEdit={() => routeDrawingPerson.setIsEditingPerson(true)}
        setPersonResponsible={routeDrawingPerson.setPersonResponsible}
        handlePersonResponsibleChange={routeDrawingPerson.handlePersonResponsibleChange}
        drawnRouteProps={{
          contractId,
          files: drawnRouteFiles.files,
          newFiles: drawnRouteFiles.newFiles,
          handleFileDrop: drawnRouteFiles.handleFileDrop,
          handleFileDelete: drawnRouteFiles.handleFileDelete,
          handleSave: drawnRouteFiles.uploadFile,
          loading: drawnRouteFiles.loading
        }}
        pdfProps={{
          contractId,
          files: pdfWithRouteFiles.files,
          newFiles: pdfWithRouteFiles.newFiles,
          handleFileDrop: pdfWithRouteFiles.handleFileDrop,
          handleFileDelete: pdfWithRouteFiles.handleFileDelete,
          handleSave: pdfWithRouteFiles.uploadFile,
          loading: pdfWithRouteFiles.loading
        }}
        isDisabled={!routePreparation.mapVerification?.correctnessOfTheMap}
      />

      {showCompleteButton && (
        <CompleteStepButton
          handleComplete={handleComplete}
          loading={loading}
          titleKey="routePreparation.completeButton.title"
          descriptionKey="routePreparation.completeButton.allActionsCompleted"
          warningMessage="routePreparation.completeButton.warning"
        />
      )}

      <Remarks 
        stepId="ROUTE_PREPARATION" 
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

export default RoutePreparation; 