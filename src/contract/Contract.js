import { useParams, Link } from "react-router-dom";
import './Contract.css';
import Sidebar from './SideBar';
import PreliminaryPlan from './steps/PreliminaryPlan';
import { useState } from 'react';
import Details from './details/Details';


const Contract = () => {
  const { contractId } = useParams();

  const [selectedStep, setSelectedStep] = useState('Details');

  const renderStepDetails = () => {
    switch (selectedStep) {
      case 'Details':
        return <Details contractId={contractId} />;
      case 'PreliminaryPlan':
        return <PreliminaryPlan contractId={contractId} />;

      default:
        return <p>Jeszcze nie zrobione</p>;
    }
  };


  return (
    <div className="container">
    <div className="header">
      <button className="back-button" onClick={() => window.history.back()}>&larr;</button>
      <Link to="#" onClick={() => setSelectedStep('Details')}>
         <h2>Szczegóły Kontraktu</h2>
      </Link>
    </div>
    <div className="content">
    <Sidebar setSelectedStep={setSelectedStep} />
    <main className="main-content">
        <article>
        {renderStepDetails()}
          </article>
        </main>
      </div>
    </div>
  );
};

export default Contract;
