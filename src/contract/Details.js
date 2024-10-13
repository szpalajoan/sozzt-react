import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import useFetch from "../useFetch";
import './Details.css';
import useDataFetching from '../useDataFetching';

const FileLink = ({ contractId, fileId, fileName }) => {
  const fileUrl = `http://localhost:8080/api/contracts/${contractId}/${fileId}`;

  return (
    <div className="form-group">
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        {fileName}
      </a>
    </div>
  );
};

const Details = ({ contractId }) => {
  const { data: contract, isPending } = useFetch('contracts/' + contractId);
  const { data: fetchedFiles, isPending: isFilesPending } = useFetch(`contracts/${contractId}/contract-scan`);

  const [files, setFiles] = useState([]);
  const [formState, setFormState] = useState({});
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);

  const { fetchData, isPutPending, error } = useDataFetching('contracts/');


  useEffect(() => {
    if (fetchedFiles) {
      setFiles(fetchedFiles);
    }
  }, [fetchedFiles]);


  if (isPending || isFilesPending) return <div>Loading...</div>;
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

    try {
      await fetchData(`contracts/${contractId}`, 'PUT', updatedContract);

      // Usuwanie plików
      if (deletedFiles.length > 0) {
        await Promise.all(
          deletedFiles.map(async (fileId) => {
            await fetchData(`contracts/${contractId}/${fileId}`, 'DELETE');
          })
        );
        setDeletedFiles([]); // Wyczyść stan usuniętych plików
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
        setNewFiles([]); // Wyczyść stan nowych plików
      }

      

    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    }
  };

  return (
    <Box>
      <TextField
        label="Numer umowy klienta"
        name="contractNumber"
        value={formState.contractNumber || contractDetails.contractNumber}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nr roboczy"
        name="workNumber"
        value={formState.workNumber || contractDetails.workNumber}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nr stacji trafo i obwód"
        name="transformerStationNumberWithCircuit"
        value={formState.transformerStationNumberWithCircuit || location.transformerStationNumberWithCircuit}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Region"
        name="region"
        value={formState.region || location.region}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Dzielnica"
        name="district"
        value={formState.district || location.district}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Miasto"
        name="city"
        value={formState.city || location.city}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Numer pola"
        name="fieldNumber"
        value={formState.fieldNumber || location.fieldNumber}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Numer kontraktu klienta"
        name="customerContractNumber"
        value={formState.customerContractNumber || contractDetails.customerContractNumber}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Data zamówienia"
        name="orderDate"
        type="date"
        value={formState.orderDate || contractDetails.orderDate.split('T')[0]}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />

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


      <Dropzone onDrop={handleFileDrop} accept=".pdf,.jpg,.png">
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
        <Button variant="contained" color="primary" onClick={handleSave}>Zapisz</Button>
      </Box>
    </Box>
  );
};

export default Details;
