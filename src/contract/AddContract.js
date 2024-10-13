import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataFetching from '../useDataFetching';
import { v4 as uuidv4 } from 'uuid';
import { Delete, CloudUpload } from '@mui/icons-material';
import { IconButton, List, ListItem, ListItemAvatar, ListItemText, Box, Button, Typography } from '@mui/material';
import Dropzone from 'react-dropzone';
import { formFields, renderTextFields } from './details/DetailsFields'; // Importujemy nasze helpery
import './AddContract.css';



const AddContract = () => {
  const [formState, setFormState] = useState({});
  const [contractScans, setContractScans] = useState([]);
  const navigate = useNavigate();
  const { fetchData, isPending, error } = useDataFetching('contracts/');

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
        orderDate: formState.orderDate ? new Date(formState.orderDate).toISOString() : formState.orderDate, // Zamiana formatu daty
      }
    };

    try {
      const response = await fetchData('contracts/', 'POST', newContract);

      if (response && response.contractId && contractScans.length > 0) {
        await Promise.all(
          contractScans.map(async (scan) => {
            const formData = new FormData();
            formData.append('file', scan);
            formData.append('fileId', uuidv4());

            await fetchData(`contracts/${response.contractId}/contract-scan`, 'POST', formData);
          })
        );
      }

      navigate('/');
    } catch (error) {
      console.error('Błąd podczas dodawania kontraktu:', error);
    }
  };

  const handleDrop = (acceptedFiles) => {
    setContractScans([...contractScans, ...acceptedFiles]);
  };

  const handleRemoveFile = (file) => {
    setContractScans(contractScans.filter(f => f !== file));
  };

  // Używamy dynamicznego formularza z formFields
  const fields = formFields({}, {});

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Dodaj nowy kontrakt</Typography>
      <form onSubmit={handleSubmit}>
        {renderTextFields(fields, formState, handleInputChange)}

        <Box mb={2}>
          <Typography variant="h6">Skany zlecenia</Typography>
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                className="dropzone-container"
              >
                <input {...getInputProps()} />
                <CloudUpload className="upload-icon" />
                <Typography>Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać</Typography>
              </Box>
            )}
          </Dropzone>
          <List>
            {contractScans.map((file, index) => (
              <ListItem
                key={index}
                className="list-item"
              >
                <ListItemAvatar>
                  <img src="/path/to/pdf-icon.png" alt="file-icon" width="40" />
                </ListItemAvatar>
                <ListItemText primary={file.name} />
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(file)}>
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>

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
