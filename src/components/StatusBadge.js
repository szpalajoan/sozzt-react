import React from 'react';
import { useTranslation } from 'react-i18next';

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`status-badge ${status.toLowerCase()}`}>
      {t(`stepStatus.${status}`)}
    </div>
  );
};

export default StatusBadge;
