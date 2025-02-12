import React, { Suspense } from 'react';
import { Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import './Remarks.css';
import RemarksContent from './RemarksContent';

const RemarksLoader = () => (
  <div className="remarks-section">
    <div className="remarks-section-header">
      <h2 className="remarks-section-title">
        <span>Uwagi</span>
      </h2>
    </div>
    <div className="remarks-loading">
      <Typography variant="body2">
        Ładowanie uwag...
      </Typography>
    </div>
  </div>
);

const Remarks = ({ stepId, contractId, onRemarkChange }) => {
  return (
    <Suspense fallback={<RemarksLoader />}>
      <RemarksContent 
        stepId={stepId} 
        contractId={contractId} 
        onRemarkChange={onRemarkChange}
      />
    </Suspense>
  );
};

export default Remarks; 