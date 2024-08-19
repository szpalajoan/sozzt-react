import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataFetching from '../useDataFetching';

const FormInput = ({ label, type = 'text', value, onChange, required = false, readOnly = false }) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
    />
  </div>
);

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
      await fetchData('POST', newContract);
      navigate('/');
    } catch (error) {
      console.error('Błąd podczas dodawania kontraktu:', error);
    }
  };

  return (
    <div className="container">

    <div>
      <div className="header">
      <button className="back-button" onClick={() => window.history.back()}>&larr;</button>
      <h2>Dodaj nowy kontrakt</h2>
    </div>
    
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
        <button type="submit" disabled={isPending}>Dodaj kontrakt</button>
        {isPending && <p>Trwa dodawanie kontraktu...</p>}
        {error && <p>Błąd podczas dodawania kontraktu: {error}</p>}
      </form>
    </div>

    </div>
  );
};

export default AddContract;
