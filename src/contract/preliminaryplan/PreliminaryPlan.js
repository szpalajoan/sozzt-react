import React, { useState, useEffect } from 'react';
import useFetch from "../../useFetch";
import { renderTextFields } from '../renderTextFields';
import { preliminaryPlanFields } from './preliminaryPlanFields';
import useFileHandler from '../useFileHandler';
import { Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import FileUploadSection from '../FileUploadSection';
import useDataFetching from '../../useDataFetching';
import { useNavigate } from 'react-router-dom';

const PreliminaryPlan = ({ contractId }) => {
  const { data: preliminaryPlan, isPending: isPreliminaryPlanPending, refetch: refetchPreliminaryPlan } = useFetch(`contracts/preliminary-plans/${contractId}`);
  const { data: fetchedFiles, isPending: isFilesPending, refetch: refetchFiles } = useFetch(`contracts/${contractId}/files?fileType=PRELIMINARY_MAP`);

  const { fetchData } = useDataFetching();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleSave = async () => {
    const editPreliminaryPlanDto = {
      ...preliminaryPlan,
      googleMapUrl: formState.googleMapUrl || preliminaryPlan.googleMapUrl
    };
    setLoading(true);
    try {
      await fetchData(`contracts/preliminary-plans/${contractId}`, 'PUT', editPreliminaryPlanDto);

      await deleteFiles(contractId, fetchData);
      await uploadFiles(contractId, fetchData, 'preliminary-maps');

      refetchPreliminaryPlan();
      refetchFiles();
      resetFiles();

    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleComplete = async () => {
    await handleSave();

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

  if (isPreliminaryPlanPending) return <div>Loading...</div>;
  if (!preliminaryPlan) return <div>Nie znaleziono wstępnego planu</div>;

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const fields = preliminaryPlanFields(preliminaryPlan);


  return (
    <Box  className="main-content">
      <h2>Wstępny plan</h2>
      {renderTextFields(fields, formState, handleInputChange)}

      <FileUploadSection
        contractId={contractId}
        files={files}
        newFiles={newFiles}
        handleFileDrop={handleFileDrop}
        handleFileDelete={handleFileDelete}
      />

      <Box mt={3} display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Zapisz'}
        </Button>
        <Button variant="contained" className="finalize-button" onClick={handleComplete} disabled={loading}>
          Kompletuj
        </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PreliminaryPlan;