import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PersonOutline as PersonIcon } from '@mui/icons-material';
import useFetch from "../useFetch";
import { Badge, Chip } from '@mui/material';
import { Comment as CommentIcon, TaskAlt, PriorityHigh, ErrorOutline } from '@mui/icons-material';
import StatusBadge from '../components/StatusBadge';

const Section = ({ stepType, deadline, name, stepStatus, comments, onClick, pendingRemarks }) => {
  const { t: translate } = useTranslation(); 

  return (
    <div className="section" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="section-header">
        <h3>{translate(`steps.${stepType}`)}</h3>
        <span className="date">{new Date(deadline).toLocaleDateString()}</span> 
      </div>
      <div className="section-details">
        <div className="assigned-person">
          <PersonIcon fontSize="small" />
          <span>{name}</span>
        </div>
        <StatusBadge status={stepStatus} />
      </div>
      {comments && <p className="comments">{comments}</p>}
      {pendingRemarks > 0 && (
        <div className="remarks-indicator">
          <ErrorOutline fontSize="small" />
          <span>
            {pendingRemarks === 1 
              ? translate('remarks.pending_one') 
              : `${pendingRemarks} ${translate('remarks.toComplete')}`
            }
          </span>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ contractId, setSelectedStep, contract, remarks }) => {
  const { t: translate } = useTranslation(); 
  const navigate = useNavigate();

  const getPendingRemarksCount = (stepType) => {
    if (!remarks) return 0;
    
    const remarkType = {
      'PRELIMINARY_PLAN': 'PRELIMINARY_PLAN',
      'TERRAIN_VISION': 'TERRAIN_VISION',
      'ROUTE_PREPARATION': 'ROUTE_PREPARATION',
      'CONSENTS_COLLECTION': 'CONSENTS_COLLECTION',
      'PREPARATION_OF_DOCUMENTATION': 'PREPARATION_OF_DOCUMENTATION',
      'LAND_EXTRACTS': 'LAND_EXTRACTS',
      'PROJECT_PURPOSES_MAP_PREPARATION': 'PROJECT_PURPOSES_MAP_PREPARATION',
    }[stepType] || 'GENERAL_CONTRACT';
    
    return remarks.filter(remark => 
      remark.remarkType === remarkType && 
      !['DONE', 'CANCELLED'].includes(remark.remarkStatus)
    ).length;
  };

  const handleStepChange = (stepType) => {
    setSelectedStep(stepType);
  };

  return (
    <aside className="sidebar">
      {contract?.contractSteps?.length > 0 ? (
        contract.contractSteps.map((step, index) => (
          <Section
            key={index}
            stepType={step.contractStepType} 
            deadline={step.deadline} 
            name="Daniel" 
            stepStatus={step.contractStepStatus}
            pendingRemarks={getPendingRemarksCount(step.contractStepType)}
            onClick={() => handleStepChange(step.contractStepType)}
          />
        ))
      ) : (
        <p>{translate('contract.finalize.introduction')}</p> 
      )}
    </aside>
  );
};

export default Sidebar;
