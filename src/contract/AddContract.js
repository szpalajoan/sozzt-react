import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataFetching from '../useDataFetching';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { Delete, CloudUpload } from '@mui/icons-material';
import Dropzone from 'react-dropzone';
import FormInput from './FormInput';
import './AddContract.css';

const formatDateToISO = (date) => new Date(date).toISOString();


const AddContract = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [transformerStationNumberWithCircuit, setTransformerStationNumberWithCircuit] = useState('');
  const [fieldNumber, setFieldNumber] = useState('');
  const [googleMapLink, setGoogleMapLink] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [workNumber, setWorkNumber] = useState('');
  const [customerContractNumber, setCustomerContractNumber] = useState('');
  const [orderDate, setOrderDate] = useState('');

  const [contractScans, setContractScans] = useState([]);
  const navigate = useNavigate();
  const { fetchData, isPending, error } = useDataFetching('contracts/');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newContract = {
      invoiceNumber,
      location: {
        region,
        district,
        city,
        transformerStationNumberWithCircuit,
        fieldNumber,
        googleMapLink
      },
      contractDetailsDto: {
        contractNumber,
        workNumber,
        customerContractNumber,
        orderDate: formatDateToISO(orderDate)
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Dodaj nowy kontrakt</Typography>
      <form onSubmit={handleSubmit}>
        <FormInput label="Numer faktury" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
        <FormInput label="Region" value={region} onChange={(e) => setRegion(e.target.value)} required />
        <FormInput label="Dzielnica" value={district} onChange={(e) => setDistrict(e.target.value)} />
        <FormInput label="Miasto" value={city} onChange={(e) => setCity(e.target.value)} required />
        <FormInput label="Numer stacji trafo i obwód" value={transformerStationNumberWithCircuit} onChange={(e) => setTransformerStationNumberWithCircuit(e.target.value)} required />
        <FormInput label="Numer pola" value={fieldNumber} onChange={(e) => setFieldNumber(e.target.value)} />
        <FormInput label="Link do mapy Google" value={googleMapLink} onChange={(e) => setGoogleMapLink(e.target.value)} />
        <FormInput label="Numer umowy klienta" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} required />
        <FormInput label="Nr roboczy" value={workNumber} onChange={(e) => setWorkNumber(e.target.value)} required />
        <FormInput label="Numer kontraktu klienta" value={customerContractNumber} onChange={(e) => setCustomerContractNumber(e.target.value)} required />
        <FormInput label="Data zamówienia" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />

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
