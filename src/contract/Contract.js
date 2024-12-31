import { useParams, useNavigate } from "react-router-dom";
import './Contract.css';
import Sidebar from './SideBar';
import PreliminaryPlan from './preliminaryplan/PreliminaryPlan';
import TerrainVision from './terrainVision/TerrainVision';
import RoutePreparation from './routepreparation/RoutePreparation';
import ConsentsCollection from './consentscollection/ConsentCollection';
import { useState, useEffect } from 'react';
import Details from './details/Details';
import useFetch from "../useFetch";

const Contract = () => {
  const { contractId, step } = useParams();
  const [selectedStep, setSelectedStep] = useState(step || 'Details');
  const navigate = useNavigate();
  const { data: contract } = useFetch(`contracts/${contractId}`);


  useEffect(() => {
    if (step) {
      setSelectedStep(step);
    } else {
      setSelectedStep('Details');
    }
  }, [step]);

  const handleStepChange = (newStep) => {
    if (newStep === 'Details') {
      navigate(`/contract/${contractId}`, { replace: true });
    } else {
      navigate(`/contract/${contractId}/${newStep}`, { replace: true });
    }
    setSelectedStep(newStep);
  };

  const renderStepDetails = () => {
    switch (selectedStep) {
      case 'Details':
        return <Details contractId={contractId} />;
      case 'PRELIMINARY_PLAN':
        return <PreliminaryPlan contractId={contractId} />;
      case 'TERRAIN_VISION':
        return <TerrainVision contractId={contractId} />;
      case 'ROUTE_PREPARATION':
        return <RoutePreparation contractId={contractId} />;
      case 'CONSENTS_COLLECTION':
        return <ConsentsCollection contractId={contractId} />;
      default:
        return <p>Jeszcze nie zrobione</p>;
    }
  };

  const goBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="page-container">
      <header className="fixed-header">
      <button className="back-button" onClick={goBackToHome}></button>
              <h2 className="header-title" onClick={() => handleStepChange('Details')} style={{ cursor: 'pointer' }}>
          {contract ? `${contract.contractDetails.contractNumber} - ${contract.location.city}` : 'ładowanie' }

        </h2>
      </header>
      <div className="contract-container">
        <Sidebar setSelectedStep={handleStepChange} contractId={contractId} />
        <main className="content-wrapper">
          <article>
            {renderStepDetails()}
          </article>
        </main>
      </div>
    </div>
  );
};

export default Contract;