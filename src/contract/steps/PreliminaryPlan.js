import React, { useState, useEffect } from 'react';
import useFetch from "../../useFetch";
import { renderTextFields } from './../renderTextFields';
import { preliminaryPlanFields } from './preliminaryPlanFields';
import useFileHandler from './../useFileHandler';
import {  Button, Box,CircularProgress } from '@mui/material';
import FileUploadSection from './../FileUploadSection';
import useDataFetching from '../../useDataFetching';


const PreliminaryPlan = ({ contractId }) => {
  const { data: preliminaryPlan, isPending: isPreliminaryPlanPending, refetch: refetchPreliminaryPlan } = useFetch(`contracts/preliminary-plans/${contractId}`);
  const { data: fetchedFiles, isPending: isFilesPending, refetch: refetchFiles } = useFetch(`contracts/${contractId}/files?fileType=PRELIMINARY_MAP`);

  const { fetchData } = useDataFetching();

  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const editPreliminaryPlanDto  = {
      ...preliminaryPlan,
      googleMapUrl: formState.googleMapUrl || preliminaryPlan.googleMapUrl
    };
    setLoading(true);
    try {
      await fetchData(`contracts/preliminary-plans/${contractId}/google-map-url`, 'PUT',  editPreliminaryPlanDto);

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
      <Box>
        <h2>Wstępny plan</h2>
      {renderTextFields(fields, formState, handleInputChange)}

    
      <FileUploadSection
        contractId={contractId}
        files={files}
        newFiles={newFiles}
        handleFileDrop={handleFileDrop}
        handleFileDelete={handleFileDelete}
      />

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Zapisz'}
        </Button>
      </Box>
    </Box>
  );
};

export default PreliminaryPlan;