import { useParams, useNavigate } from "react-router-dom";
import './Contract.css';
import Sidebar from './SideBar';
import PreliminaryPlan from './preliminaryplan/PreliminaryPlan';
import TerrainVision from './terrainVision/TerrainVision';
import ProjectPurposesMapPreparation from './projectpurposesmappreparation/ProjectPurposesMapPreparation';
import ConsentsCollection from './consentscollection/ConsentCollection';
import PreparationOfDocumentation from './preparationofdocumentation/PreparationOfDocumentation';
import LandExtracts from './landextracts/LandExtracts';
import { useState, useEffect } from 'react';
import Details from './details/Details';
import useFetch from "../useFetch";
import { Comment as CommentIcon } from '@mui/icons-material';
import { IconButton, Button, Typography } from '@mui/material';
import AddRemarkDialog from '../components/remarks/AddRemarkDialog';
import { useTranslation } from 'react-i18next';
import useDataFetching from '../useDataFetching';
import { formatDateToInstant } from '../utils/dateUtils';
import { Add as AddIcon } from '@mui/icons-material';
import RoutePreparation from './routepreparation/RoutePreparation';

const Contract = () => {
  const { contractId, step } = useParams();
  const [selectedStep, setSelectedStep] = useState(step || 'Details');
  const navigate = useNavigate();
  const { data: contract, refetch: refetchContract } = useFetch(`contracts/${contractId}`);
  const { data: remarks, refetch: refetchRemarks } = useFetch(`contracts/remarks/${contractId}`);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { fetchData } = useDataFetching();

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
    refetchContract();
    refetchRemarks();
  };

  const handleAddRemark = async (newRemark) => {
    try {
      const addRemarkDto = {
        contractId,
        remarkType: newRemark.selectedStep,
        title: newRemark.title,
        description: newRemark.description,
        assignedTo: newRemark.assignedTo,
        ...(newRemark.deadline && {
          deadline: formatDateToInstant(newRemark.deadline)
        })
      };

      const response = await fetchData('contracts/remarks/', 'POST', addRemarkDto);
      if (response) {
        refetchRemarks();
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding remark:', error);
    }
  };

  const renderStepDetails = () => {
    const commonProps = {
      contractId,
      onRemarkChange: refetchRemarks,
      remarks: remarks,
      refetchContract
    };

    switch (selectedStep) {
      case 'Details':
        return <Details {...commonProps} />;
      case 'PRELIMINARY_PLAN':
        return <PreliminaryPlan {...commonProps} />;
      case 'TERRAIN_VISION':
        return <TerrainVision {...commonProps} />;
      case 'PROJECT_PURPOSES_MAP_PREPARATION':
        return <ProjectPurposesMapPreparation {...commonProps} />;
      case 'ROUTE_PREPARATION':
        return <RoutePreparation {...commonProps} />;
      case 'CONSENTS_COLLECTION':
        return <ConsentsCollection {...commonProps} />;
      case 'PREPARATION_OF_DOCUMENTATION':
        return <PreparationOfDocumentation {...commonProps} />;
      case 'LAND_EXTRACTS':
        return <LandExtracts {...commonProps} />;
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
        <div className="header-content">
          <h2 className="header-title" onClick={() => handleStepChange('Details')} style={{ cursor: 'pointer' }}>
            {contract ? `${contract.contractDetails.contractNumber} - ${contract.location.city}` : 'ładowanie' }
          </h2>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="header-add-remark-button"
            startIcon={<AddIcon />}
            variant="outlined"
          >
            {t('remarks.addRemark')}
          </Button>
        </div>
      </header>
      <div className="contract-container">
        <Sidebar 
          setSelectedStep={handleStepChange} 
          contractId={contractId}
          contract={contract}
          remarks={remarks}
        />
        <main className="content-wrapper">
          <article>
            {renderStepDetails()}
          </article>
        </main>
      </div>

      <AddRemarkDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddRemark}
        steps={contract?.contractSteps}
        showStepSelect
      />
    </div>
  );
};

export default Contract;