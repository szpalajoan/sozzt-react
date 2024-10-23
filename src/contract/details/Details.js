import React, { useState, useEffect } from 'react';
import {  Button, Box,CircularProgress } from '@mui/material';
import useFetch from "../../useFetch";
import './Details.css';
import useDataFetching from '../../useDataFetching';
import { contractFields, renderTextFields } from './DetailsFields';
import FileUploadSection from './../FileUploadSection';
import useFileHandler from './../useFileHandler';

const Details = ({ contractId }) => {
  const { data: contract, isPending: isContractPending, refetch: refetchContract } = useFetch(`contracts/${contractId}`);
  const { data: fetchedFiles, isPending: isFilesPending, refetch: refetchFiles } = useFetch(`contracts/${contractId}/contract-scans`);

  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);

  const { fetchData } = useDataFetching('contracts/');
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

  useEffect(() => {
    if (contract) {
      setFormState({
        region: contract.location.region,
        district: contract.location.district,
        city: contract.location.city,
        transformerStationNumberWithCircuit: contract.location.transformerStationNumberWithCircuit,
        fieldNumber: contract.location.fieldNumber,
        contractNumber: contract.contractDetails.contractNumber,
        workNumber: contract.contractDetails.workNumber,
        customerContractNumber: contract.contractDetails.customerContractNumber,
        orderDate: contract.contractDetails.orderDate,
      });
    }
  }, [contract]);

  if (isContractPending || isFilesPending) return <div>Loading...</div>;
  if (!contract) return <div>Nie znaleziono kontraktu</div>;

  const { contractDetails, location } = contract;

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const updatedContract = {
      ...contract,
      location: {
        ...location,
        region: formState.region || location.region,
        district: formState.district || location.district,
        city: formState.city || location.city,
        transformerStationNumberWithCircuit: formState.transformerStationNumberWithCircuit || location.transformerStationNumberWithCircuit,
        fieldNumber: formState.fieldNumber || location.fieldNumber,
      },
      contractDetails: {
        ...contractDetails,
        contractNumber: formState.contractNumber || contractDetails.contractNumber,
        workNumber: formState.workNumber || contractDetails.workNumber,
        customerContractNumber: formState.customerContractNumber || contractDetails.customerContractNumber,
        orderDate: formState.orderDate || contractDetails.orderDate,
      },
    };

    setLoading(true);

    try {
      await fetchData(`contracts/${contractId}`, 'PUT', updatedContract);

      await deleteFiles(contractId, fetchData);
      await uploadFiles(contractId, fetchData);

      refetchContract();
      refetchFiles();
      resetFiles();


    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const fields = contractFields(contractDetails, location);


  return (
    <Box>
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

export default Details;
