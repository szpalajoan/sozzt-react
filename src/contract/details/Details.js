import React, { useState, useEffect } from 'react';
import { Button, Box, CircularProgress, Snackba } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import useFetch from "../../useFetch";
import './Details.css';
import useDataFetching from '../../useDataFetching';
import { contractFields } from './DetailsFields';
import { renderTextFields } from './../renderTextFields';
import FileUploadSection from './../FileUploadSection';
import useFileHandler from './../useFileHandler';

const Details = ({ contractId }) => {
  const { data: contract, isPending: isContractPending, refetch: refetchContract } = useFetch(`contracts/${contractId}`);
  const { data: fetchedFiles, isPending: isFilesPending, refetch: refetchFiles } = useFetch(`contracts/${contractId}/files?fileType=CONTRACT_SCAN_FROM_TAURON`);

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
    if (fetchedFiles && files.length === 0) {
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
        orderDate: contract.contractDetails.orderDate ? contract.contractDetails.orderDate.split('T')[0] : "",
      });
    }
  }, [contract]);

  if (isContractPending) return <div>Loading...</div>;
  if (!contract) return <div>Nie znaleziono kontraktu</div>;

  const { contractDetails, location } = contract;

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log("handleSave", formState);
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
        orderDate: formState.orderDate ? `${formState.orderDate}T00:00:00Z` : contractDetails.orderDate,
      },
    };

    setLoading(true);

    try {
      await fetchData(`contracts/${contractId}`, 'PUT', updatedContract);

      await deleteFiles(contractId, fetchData);
      await uploadFiles(contractId, fetchData, 'contract-scans');

      refetchContract();
      refetchFiles();
      resetFiles();

    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    await handleSave();

    console.log("Kontrakt został sfinalizowany.");
    try {
          await fetchData(`contracts/${contractId}/finalize-introduction`, 'POST');

          refetchContract();
        } catch (error) {
          console.error('Błąd podczas finalizacji kontraktu:', error);
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


      <Box mt={3} display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Zapisz'}
        </Button>
        {contract.contractSteps && contract.contractSteps.length === 0 && (
          <Button variant="contained" className="finalize-button" onClick={handleFinalize}>
            Finalizuj
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Details;
