import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, IconButton, List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';
import { Delete } from '@mui/icons-material';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import useFetch from "../../useFetch";
import './Details.css';
import useDataFetching from '../../useDataFetching';
import { formFields, renderTextFields } from './DetailsFields';
import FileLink from './../FileLink';

const Details = ({ contractId }) => {
  const { data: contract, isPending: isContractPending, refetch: refetchContract } = useFetch(`contracts/${contractId}`);
  const { data: fetchedFiles, isPending: isFilesPending, refetch: refetchFiles } = useFetch(`contracts/${contractId}/contract-scan`);

  const [files, setFiles] = useState([]);
  const [formState, setFormState] = useState({});
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { fetchData } = useDataFetching('contracts/');

  useEffect(() => {
    if (fetchedFiles) {
      console.log("Pobrano pliki:", fetchedFiles);

      setFiles(fetchedFiles);
    }
  }, [fetchedFiles]);

  if (isContractPending || isFilesPending) return <div>Loading...</div>;
  if (!contract) return <div>Nie znaleziono kontraktu</div>;

  const { contractDetails, location } = contract;

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFileDrop = (acceptedFiles) => {
    setNewFiles([...newFiles, ...acceptedFiles]);
  };

  const handleFileDelete = (fileId) => {
    setDeletedFiles([...deletedFiles, fileId]);
    setFiles((prevFiles) => prevFiles.filter(file => file.fileId !== fileId));
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
      contractDetailsDto: {
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

      if (deletedFiles.length > 0) {
        await Promise.all(
          deletedFiles.map(async (fileId) => {
            await fetchData(`contracts/${contractId}/${fileId}`, 'DELETE');
          })
        );
        setDeletedFiles([]);
      }

      if (newFiles.length > 0) {
        await Promise.all(
          newFiles.map(async (scan) => {
            const formData = new FormData();
            formData.append('file', scan);
            formData.append('fileId', uuidv4());

            await fetchData(`contracts/${contractId}/contract-scan`, 'POST', formData);
          })
        );
        setNewFiles([]);
      }


      refetchContract();
      refetchFiles(); 

    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    } finally {
      setLoading(false); // Zakończ ładowanie
    }
  };

  const fields = formFields(contractDetails, location);


  return (
    <Box>
      {renderTextFields(fields, formState, handleInputChange)}

      <Typography variant="h6" gutterBottom>Załączniki</Typography>
      <List>
        {files && files.length > 0 && files.map(file => (
          <ListItem
            key={file.fileId}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleFileDelete(file.fileId)}>
                <Delete />
              </IconButton>
            }
          >
            <FileLink key={file.fileId} contractId={contractId} fileId={file.fileId} fileName={file.fileName} />
          </ListItem>
        ))}
        {newFiles.length > 0 && newFiles.map((file, index) => (
          <ListItem key={index}>
            <ListItemText primary={file.name} />
          </ListItem>
        ))}
      </List>

      <Dropzone onDrop={handleFileDrop}>
        {({ getRootProps, getInputProps }) => (
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ddd',
              borderRadius: '8px',
              p: 2,
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              mt: 2,
            }}
          >
            <input {...getInputProps()} />
            <Typography>Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać</Typography>
          </Box>
        )}
      </Dropzone>

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Zapisz'}
        </Button>
      </Box>
    </Box>
  );
};

export default Details;
