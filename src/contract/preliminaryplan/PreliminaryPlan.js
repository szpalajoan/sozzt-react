import React, { useState, useEffect } from 'react';
import useFetch from "../../useFetch";
import { renderTextFields } from '../renderTextFields';
import { preliminaryPlanFields } from './preliminaryPlanFields';
import useFileHandler from '../useFileHandler';
import { Button, Box, CircularProgress, Snackbar, Alert, Typography } from '@mui/material';
import FileUploadSection from '../../components/FileUploadSection';
import useDataFetching from '../../useDataFetching';
import { useNavigate } from 'react-router-dom';
import OpenFolderButton from '../../components/OpenFolderButton';
import SnackbarAlert from '../../components/SnackbarAlert';
import CompleteStepButton from '../../components/CompleteStepButton';
import Remarks from '../../components/remarks/Remarks';

const PreliminaryPlan = ({ contractId }) => {
  const { data: preliminaryPlan, isPending: isPreliminaryPlanPending, refetch: refetchPreliminaryPlan } = useFetch(`contracts/preliminary-plans/${contractId}`);
  const { data: fetchedFiles, isPending: isFilesPending, refetch: refetchFiles } = useFetch(`contracts/${contractId}/files?fileType=PRELIMINARY_MAP`);
  const { data: contract } = useFetch(`contracts/${contractId}`); //tylko po to zeby pobrac status 

  const { fetchData } = useDataFetching();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [showFinalizeButton, setShowFinalizeButton] = useState(false);

  useEffect(() => {
    if (contract && contract.contractSteps) {
      const foundPreliminaryPlanStep = contract.contractSteps.find(step => step.contractStepType === "PRELIMINARY_PLAN");
      setShowFinalizeButton(foundPreliminaryPlanStep && foundPreliminaryPlanStep.contractStepStatus !== "DONE");
    }
  }, [contract]);

  const handleSave = async () => {
    const editPreliminaryPlanDto = {
      ...preliminaryPlan,
      googleMapUrl: formState.googleMapUrl || preliminaryPlan.googleMapUrl
    };
    setLoading(true);
    try {
      await fetchData(`contracts/preliminary-plans/${contractId}`, 'PUT', editPreliminaryPlanDto);

      refetchPreliminaryPlan();
      setOpenSnackbar(true);
      setErrorMessage('Mapa została zapisana pomyślnie.');
    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleComplete = async () => {
    try {
      await fetchData(`contracts/preliminary-plans/${contractId}/complete`, 'POST');

      refetchPreliminaryPlan();
      console.log("Wstępny plan został skompletowany.");
      navigate(0);

    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message || 'Wystąpił błąd podczas kompletowania wstępnego planu.');
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

  const handleUploadPreliminaryMap = async () => {
    setLoading(true);
    try {
      await uploadFiles(contractId, fetchData, 'preliminary-maps');
      refetchPreliminaryPlan();
      refetchFiles();
      resetFiles();
      setOpenSnackbar(true);
      setErrorMessage('Mapa wstępna została pomyślnie wgrana.');
    } catch (error) {
      console.error('Błąd podczas wgrywania mapy wstępnej:', error);
      setErrorMessage('Wystąpił błąd podczas wgrywania mapy wstępnej.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  if (isPreliminaryPlanPending) return <div>Loading...</div>;
  if (!preliminaryPlan) return <div>Nie znaleziono wstępnego planu</div>;

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const fields = preliminaryPlanFields(preliminaryPlan);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      <Box className="main-content">
        <h2 className="section-title">Mapa google </h2>
        {renderTextFields(fields, formState, handleInputChange)}

        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Zapisz'}
          </Button>
        </Box>
      </Box>

      <Box className="main-content">
        <h2 className="section-title">Wstępny plan</h2>
        {preliminaryPlan.preliminaryMapUploaded ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
              Mapa została już wgrana. Jeśli chcesz wprowadzić zmiany, zrób to bezpośrednio w folderze.
            </Typography>
            <OpenFolderButton
              folderPath="Projekty"
              buttonText="Otwórz folder"
            />
          </>
        ) : (
          <FileUploadSection
            contractId={contractId}
            files={files}
            newFiles={newFiles}
            handleFileDrop={handleFileDrop}
            handleFileDelete={handleFileDelete}
            titleTranslationKey="preliminaryPlan.fileUpload.preliminaryMapTitle"
            handleSave={handleUploadPreliminaryMap}
            loading={loading}
          />
        )}
      </Box>


      {preliminaryPlan.preliminaryMapUploaded && showFinalizeButton && preliminaryPlan.googleMapUrl && (
        <CompleteStepButton
          handleComplete={handleComplete}
          loading={loading}
          titleKey="preliminaryPlan.completeButton.title"
          descriptionKey="preliminaryPlan.completeButton.allActionsCompleted"
          warningMessage="preliminaryPlan.completeButton.warning"
        />
      )}

      <Remarks stepId="PRELIMINARY_PLAN" />

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={errorMessage.includes('błąd') ? 'error' : 'success'} sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>

  );
};

export default PreliminaryPlan;