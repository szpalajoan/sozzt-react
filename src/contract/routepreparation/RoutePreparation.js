import React, { useState, useEffect } from 'react';
import useFetch from "../../useFetch";
import { renderTextFields } from '../renderTextFields';
import useFileHandler from '../useFileHandler';
import { Button, Box, CircularProgress, Snackbar, Alert, Typography } from '@mui/material';
import FileUploadSection from '../../components/FileUploadSection';
import useDataFetching from '../../useDataFetching';
import { useNavigate } from 'react-router-dom';
import CompleteStepButton from '../../components/CompleteStepButton';

const RoutePreparation = ({ contractId }) => {
  const { data: routePreparation, isPending: isRoutePreparationPending, refetch: refetchRoutePreparation } = useFetch(`contracts/route-preparation/${contractId}`);
  const { data: fetchedFiles, isPending: isFilesPending, refetch: refetchFiles } = useFetch(`contracts/${contractId}/files?fileType=GEODETIC_MAP`);
  
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
      const routeStatus = contract.contractSteps.find(step => step.contractStepType === "ROUTE_PREPARATION");
      setShowFinalizeButton(routeStatus && routeStatus.contractStepStatus !== "DONE" && routePreparation && routePreparation.geodeticMapUploaded);
    }
  }, [contract, routePreparation]); 

  const handleSave = async () => {
    setLoading(true);
    try {
      await deleteFiles(contractId, fetchData);
      await uploadFiles(contractId, fetchData, 'geodetic-maps');
      refetchRoutePreparation();
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
      await fetchData(`contracts/route-preparation/${contractId}/complete`, 'POST');

      console.log("Przygotowanie mapy gotowe");
      navigate(0);

    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message || 'Wystąpił błąd podczas kompletowania przygotowania trasy.');
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

  if (isRoutePreparationPending) return <div>Loading...</div>;
  if (!routePreparation) return <div>Nie znaleziono wstępnego planu</div>;


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      <Box className="main-content">
        <h2 className="section-title">Prygotowanie mapy</h2>

        <FileUploadSection
          contractId={contractId}
          files={files}
          newFiles={newFiles}
          handleFileDrop={handleFileDrop}
          handleFileDelete={handleFileDelete}
          showSaveButton={false}
        />

        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Zapisz'}
          </Button>
        </Box>
      </Box>


      {showFinalizeButton && (
         <CompleteStepButton
          handleComplete={handleComplete}
          loading={loading}
          titleKey="routePreparation.completeButton.title"
          descriptionKey="routePreparation.completeButton.allActionsCompleted"
          warningMessage="routePreparation.completeButton.warning"
        />
        )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>

  );
};

export default RoutePreparation;