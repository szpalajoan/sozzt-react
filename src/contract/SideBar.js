import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PersonOutline as PersonIcon } from '@mui/icons-material';
import useFetch from "../useFetch";
import { Badge, Chip } from '@mui/material';
import { Comment as CommentIcon, TaskAlt, PriorityHigh, ErrorOutline } from '@mui/icons-material';

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
        <div className={`status-badge ${stepStatus.toLowerCase()}`}>
          {translate(`stepStatus.${stepStatus}`)}
        </div>
      </div>
      {comments && <p className="comments">{comments}</p>}
      {pendingRemarks > 0 && (
        <div className="remarks-indicator">
          <ErrorOutline fontSize="small" />
          <span>{pendingRemarks} {translate('remarks.toComplete')}</span>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ contractId, setSelectedStep, refetchContract }) => {
  const { t: translate } = useTranslation(); 
  const { data: contract, isPending: isContractPending } = useFetch(`contracts/${contractId}`);
  const { data: remarks } = useFetch(`contracts/remarks/${contractId}`);
  const navigate = useNavigate();

  const getPendingRemarksCount = (stepType) => {
    if (!remarks) return 0;
    
    return remarks.filter(remark => 
      remark.remarkType === stepType && 
      !['DONE', 'CANCELLED'].includes(remark.remarkStatus)
    ).length;
  };

  const handleStepChange = (stepType) => {
    setSelectedStep(stepType);
    navigate(`/contract/${contractId}/${stepType}`, { replace: true });
    refetchContract?.(); 
  };

  return (
    <aside className="sidebar">
      {isContractPending && <p>{translate('loading')}</p>} 
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
        !isContractPending && (
          <p>{translate('contract.finalize.introduction')}</p> 
        )
      )}
    </aside>
  );
};

export default Sidebar;
