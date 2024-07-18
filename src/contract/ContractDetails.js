import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import './ContractDetails.css';
import Sidebar from './SideBar';

// Komponent do renderowania tylko do odczytu pola formularza
const FormInputReadOnly = ({ label, value }) => (
  <div className="form-group">
    <label>{label}</label>
    <input type="text" value={value} readOnly />
  </div>
);

const ContractDetails = () => {
  const { contractId } = useParams();
  const { data: contract, isPending } = useFetch('contracts/' + contractId);

  if (isPending) return <div>Loading...</div>;
  if (!contract) return <div>Nie znaleziono kontraktu</div>;

  const { contractDetails, location, createdBy, createdAt, scanFromTauronUploaded } = contract;

  return (
    <div className="container">
    <div className="header">
      <button className="back-button" onClick={() => window.history.back()}>&larr;</button>
      <h2>Szczegóły Kontraktu</h2>
    </div>
    <div className="content">
      <Sidebar />
      <main className="main-content">
        <article>
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
          </article>
        </main>
      </div>
    </div>
  );
};

export default ContractDetails;
