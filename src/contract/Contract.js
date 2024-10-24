import { useParams, useNavigate } from "react-router-dom";
import './Contract.css';
import Sidebar from './SideBar';
import PreliminaryPlan from './steps/PreliminaryPlan';
import { useState, useEffect } from 'react';
import Details from './details/Details';

const Contract = () => {
  const { contractId, step } = useParams();  // Pobieramy parametry z URL
  const [selectedStep, setSelectedStep] = useState(step || 'Details');  // Ustawiamy wybrany krok
  const navigate = useNavigate();  // Hook do nawigacji

  useEffect(() => {
    if (step) {
      setSelectedStep(step);  // Aktualizujemy krok na podstawie parametru w URL
    } else {
      setSelectedStep('Details');
    }
  }, [step]);

  const handleStepChange = (newStep) => {
    if (newStep === 'Details') {
      navigate(`/contract/${contractId}`, { replace: true });  // Nawigujemy do domyślnego URL bez kroku
    } else {
      navigate(`/contract/${contractId}/${newStep}`, { replace: true });  // Nawigacja do wybranego kroku
    }
    setSelectedStep(newStep);
  };

  const renderStepDetails = () => {
    switch (selectedStep) {
      case 'Details':
        return <Details contractId={contractId} />;
      case 'preliminary-plan':
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
      <div className="content">
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
