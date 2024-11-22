import { useParams, useNavigate } from "react-router-dom";
import './Contract.css';
import Sidebar from './SideBar';
import PreliminaryPlan from './steps/PreliminaryPlan';
import { useState, useEffect } from 'react';
import Details from './details/Details';


const Contract = () => {
  const { contractId, step } = useParams(); 
  const [selectedStep, setSelectedStep] = useState(step || 'Details');
  const navigate = useNavigate(); 

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
      default:
        return <p>Jeszcze nie zrobione</p>;
    }
  };

  const goBackToHome = () => {
    navigate('/'); 
  };

  return (
    <div className="container">
      <div className="header">
      <button className="back-button" onClick={goBackToHome}>&larr;</button> 
      <h2 onClick={() => handleStepChange('Details')} style={{ cursor: 'pointer' }}>
          Szczegóły Kontraktu
        </h2> 
      </div>
      <div className="contract-container">
        <Sidebar setSelectedStep={handleStepChange} contractId={contractId} /> 
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
