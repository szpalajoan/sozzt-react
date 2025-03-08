import React, { useState, useEffect } from 'react';
import useFetch from "../../useFetch";
import { renderTextFields } from '../renderTextFields';
import useFileHandler from '../useFileHandler';
import { Button, Box, CircularProgress, Snackbar, Alert, Typography } from '@mui/material';
import FileUploadSection from '../../components/FileUploadSection';
import useDataFetching from '../../useDataFetching';
import { useNavigate } from 'react-router-dom';
import CompleteStepButton from '../../components/CompleteStepButton';
import Remarks from '../../components/remarks/Remarks';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

const ProjectPurposesMapPreparation = ({ contractId, onRemarkChange }) => {
  const { t } = useTranslation();
  const { data: mapPreparation, isPending: isMapPreparationPending, refetch: refetchMapPreparation } = useFetch(`contracts/project-purposes-map-preparation/${contractId}`);
  const { data: fetchedFiles, isPending: isFilesPending, refetch: refetchFiles } = useFetch(`contracts/${contractId}/files?fileType=GEODETIC_MAP`);
  
  const { data: contract } = useFetch(`contracts/${contractId}`);

  const { fetchData } = useDataFetching();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [showFinalizeButton, setShowFinalizeButton] = useState(false);

  useEffect(() => {
    if (contract && contract.contractSteps) {
      const mapStatus = contract.contractSteps.find(step => step.contractStepType === "PROJECT_PURPOSES_MAP_PREPARATION");
      setShowFinalizeButton(mapStatus && mapStatus.contractStepStatus !== "DONE" && mapPreparation && mapPreparation.geodeticMapUploaded);
    }
  }, [contract, mapPreparation]); 

  const handleSave = async () => {
    setLoading(true);
    try {
      await deleteFiles(contractId, fetchData);
      await uploadDocumentationFiles(contractId, fetchData, 'contracts/project-purposes-map-preparation/' + contractId + '/geodetic-maps');
      refetchMapPreparation();
      refetchFiles();
      resetFiles();

    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleComplete = async () => {
    try {
      await fetchData(`contracts/project-purposes-map-preparation/${contractId}/complete`, 'PUT');

      console.log("Przygotowanie mapy gotowe");
      navigate(0);

    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message || 'Wystąpił błąd podczas kompletowania przygotowania mapy.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const {
    files,
    newFiles,
    handleFileDrop,
    handleFileDelete,
    uploadFiles,
    uploadDocumentationFiles,
    deleteFiles,
    setFiles,
    resetFiles
  } = useFileHandler();

  useEffect(() => {
    if (fetchedFiles) {
      console.log("Pobrano pliki:", fetchedFiles);

      setFiles(fetchedFiles);
    }
  }, [fetchedFiles]);

  if (isMapPreparationPending) return <div>{t('loading')}</div>;
  if (!mapPreparation) return <div>Nie znaleziono przygotowania mapy</div>;


  return (
    <Box className="step-container">

      <Box className="main-content">
        <h2 className="section-title">Przygotowanie mapy do celów projektowych</h2>

        <FileUploadSection
          contractId={contractId}
          files={files}
          newFiles={newFiles}
          handleFileDrop={handleFileDrop}
          handleFileDelete={handleFileDelete}
          titleTranslationKey="fileUpload.scanTitle"
          handleSave={handleSave}
          loading={loading}
        />
      </Box>


      {showFinalizeButton && (
         <CompleteStepButton
          handleComplete={handleComplete}
          loading={loading}
          titleKey="completeStep.completeAndFinalize"
          descriptionKey="routePreparation.completeButton.allActionsCompleted"
          warningMessage="routePreparation.completeButton.warning"
        />
        )}

        <Remarks 
          stepId="PROJECT_PURPOSES_MAP_PREPARATION" 
          contractId={contractId} 
          onRemarkChange={onRemarkChange}
        />

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>

  );
};

export default ProjectPurposesMapPreparation;