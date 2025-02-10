import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import './Remarks.css';
import RemarkCard from './RemarkCard';
import AddRemarkDialog from './AddRemarkDialog';
import EditRemarkDialog from './EditRemarkDialog';
import { MOCK_REMARKS } from './remarksConstants';

const Remarks = ({ stepId }) => {
  const { t } = useTranslation();
  const [remarks, setRemarks] = useState(MOCK_REMARKS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editedRemark, setEditedRemark] = useState(null);

  const handleStatusChange = (remarkId, newStatus) => {
    setRemarks(remarks.map(remark => 
      remark.id === remarkId ? { ...remark, status: newStatus } : remark
    ));
  };

  const handleAddRemark = (newRemark) => {
    setRemarks([
      ...remarks,
      {
        ...newRemark,
        id: remarks.length + 1,
        stepId
      }
    ]);
  };

  const handleEdit = (remark) => {
    setEditedRemark(remark);
  };

  const handleSaveEdit = (updatedRemark) => {
    setRemarks(remarks.map(r => 
      r.id === updatedRemark.id ? updatedRemark : r
    ));
    setEditedRemark(null);
  };

  const filteredRemarks = remarks.filter(remark => remark.stepId === stepId);

  return (
    <div className="remarks-section">
      <div className="remarks-section-header">
        <h2 className="remarks-section-title">
          <span>{t('remarks.title')}</span>
          <Button
            className="add-remark-button"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <AddIcon />
          </Button>
        </h2>
      </div>

      {filteredRemarks.length === 0 ? (
        <div className="empty-remarks">
          <Typography variant="body2">
            Brak uwag dla tego kroku
          </Typography>
        </div>
      ) : (
        filteredRemarks.map(remark => (
          <RemarkCard
            key={remark.id}
            remark={remark}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
          />
        ))
      )}

      <AddRemarkDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddRemark}
      />

      {editedRemark && (
        <EditRemarkDialog
          open={!!editedRemark}
          onClose={() => setEditedRemark(null)}
          onSave={handleSaveEdit}
          remark={editedRemark}
        />
      )}
    </div>
  );
};

export default Remarks; 