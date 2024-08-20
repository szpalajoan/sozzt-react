import React from 'react';
import useFetch from "../useFetch";

const FormInputReadOnly = ({ label, value }) => (
  <div className="form-group">
    <label>{label}</label>
    <input type="text" value={value} readOnly />
  </div>
);

const FileLink = ({ contractId, fileId, fileName }) => {
  const fileUrl = `http://localhost:8080/api/contracts/${contractId}/contract-scan/${fileId}`;

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
  const { data: files, isPending: isFilesPending } = useFetch(`contracts/${contractId}/contract-scan`);


  if (isPending || isFilesPending) return <div>Loading...</div>;
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

      <div className="form-group">
        <label>Załączniki</label>
        {files && files.length > 0 ? (
          files.map(file => (
            <FileLink key={file.fileId} contractId={contractId} fileId={file.fileId} fileName={file.fileName} />
          ))
        ) : (
          <p>Brak załączników</p>
        )}
      </div>
    </div>
  );
};

export default Details;