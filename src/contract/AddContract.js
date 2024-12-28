import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataFetching from '../useDataFetching';
import { Box, Button, Typography } from '@mui/material';
import { contractFields } from './details/DetailsFields'; 
import { renderTextFields } from './renderTextFields';
import './AddContract.css';
import FileUploadSection from './FileUploadSection';
import useFileHandler from './useFileHandler';


const AddContract = () => {
  const [formState, setFormState] = useState({});
  const navigate = useNavigate();
  const { fetchData, isPending, error } = useDataFetching('contracts/');

  const {
    files,
    newFiles,
    handleFileDrop,
    handleFileDelete,
    uploadFiles,
    resetFiles
  } = useFileHandler();

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newContract = {
      invoiceNumber: formState.invoiceNumber || '',
      location: {
        region: formState.region || '',
        district: formState.district || '',
        city: formState.city || '',
        transformerStationNumberWithCircuit: formState.transformerStationNumberWithCircuit || '',
        fieldNumber: formState.fieldNumber || '',
        googleMapLink: formState.googleMapLink || ''
      },
      contractDetailsDto: {
        contractNumber: formState.contractNumber || '',
        workNumber: formState.workNumber || '',
        customerContractNumber: formState.customerContractNumber || '',
        orderDate: formState.orderDate ? new Date(formState.orderDate).toISOString() : formState.orderDate,
      }
    };

    try {
      const response = await fetchData('contracts/', 'POST', newContract);

      if (response && response.contractId) {
        await uploadFiles(response.contractId, fetchData, 'contract-scans');

        navigate(`/contract/${response.contractId}`);
      } else {
        navigate('/');
      }

      resetFiles();
    } catch (error) {
      console.error('Błąd podczas dodawania kontraktu:', error);
    }
  };


  const fields = contractFields({}, {});

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Dodaj nowy kontrakt</Typography>
      <form onSubmit={handleSubmit}>
        {renderTextFields(fields, formState, handleInputChange)}

        <FileUploadSection
          contractId={null}
          files={files}
          newFiles={newFiles}
          handleFileDrop={handleFileDrop}
          handleFileDelete={handleFileDelete}
          titleTranslationKey="fileUpload.scanTitle"
        />

        <Button type="submit" variant="contained" color="primary" disabled={isPending}>
          Dodaj kontrakt
        </Button>
        {isPending && <Typography>Trwa dodawanie kontraktu...</Typography>}
        {error && <Typography color="error">Błąd podczas dodawania kontraktu: {error}</Typography>}
      </form>
    </Box>
  );
};

export default AddContract;
