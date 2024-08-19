import React from 'react';
import useFetch from "../useFetch";

const FormInputReadOnly = ({ label, value }) => (
  <div className="form-group">
    <label>{label}</label>
    <input type="text" value={value} readOnly />
  </div>
);

const Details = ({ contractId }) => {
  const { data: contract, isPending } = useFetch('contracts/' + contractId);

  if (isPending) return <div>Loading...</div>;
  if (!contract) return <div>Nie znaleziono kontraktu</div>;

  const { contractDetails, location, createdBy, createdAt, scanFromTauronUploaded } = contract;

      return (
    <div>
          <FormInputReadOnly label="Numer umowy klienta" value={contractDetails.contractNumber} />
          <FormInputReadOnly label="Nr roboczy" value={contractDetails.workNumber} />
          <FormInputReadOnly label="Nr stacji trafo i obwód" value={location.transformerStationNumberWithCircuit} />
          <FormInputReadOnly label="Region" value={location.region} />
          <FormInputReadOnly label="Dzielnica" value={location.district} />
          <FormInputReadOnly label="Miasto" value={location.city} />
          <FormInputReadOnly label="Numer pola" value={location.fieldNumber} />
          <FormInputReadOnly label="Numer kontraktu klienta" value={contractDetails.customerContractNumber} />
          <FormInputReadOnly label="Data zamówienia" value={new Date(contractDetails.orderDate).toLocaleDateString()} />
          <FormInputReadOnly label="Utworzone przez" value={createdBy} />
          <FormInputReadOnly label="Data utworzenia" value={new Date(createdAt).toLocaleString()} />

    </div>
  );
};

export default Details;