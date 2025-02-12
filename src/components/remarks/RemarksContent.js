import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import RemarkCard from './RemarkCard';
import AddRemarkDialog from './AddRemarkDialog';
import EditRemarkDialog from './EditRemarkDialog';
import useFetch from '../../useFetch';
import useDataFetching from '../../useDataFetching';
import SnackbarAlert from '../SnackbarAlert';

const getStatusPriority = (status) => {
  const priorities = {
    'NEW': 1,
    'IN_PROGRESS': 1,
    'DONE': 2,
    'CANCELLED': 3
  };
  return priorities[status] || 0;
};

// Dodaj funkcję pomocniczą do bezpiecznej konwersji daty
const formatDateToInstant = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

const RemarksContent = ({ stepId, contractId, onRemarkChange }) => {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editedRemark, setEditedRemark] = useState(null);
  const { fetchData } = useDataFetching();
  const [loadingRemarkId, setLoadingRemarkId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const getRemarkType = (stepId) => {
    const typeMapping = {
      'PRELIMINARY_PLAN': 'PRELIMINARY_PLAN',
      'TERRAIN_VISION': 'TERRAIN_VISION',
      'ROUTE_PREPARATION': 'ROUTE_PREPARATION',
      'CONSENTS_COLLECTION': 'CONSENTS_COLLECTION',
      'PREPARATION_OF_DOCUMENTATION': 'PREPARATION_OF_DOCUMENTATION',
      'GENERAL': 'GENERAL_CONTRACT'
    };
    return typeMapping[stepId] || 'GENERAL_CONTRACT';
  };

  const remarkType = getRemarkType(stepId);
  
  const { 
    data: remarks, 
    isPending, 
    error, 
    refetch: refetchRemarks 
  } = useFetch(`contracts/remarks/${contractId}/${remarkType}`);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleStatusChange = async (remarkId, newStatus) => {
    try {
      setLoadingRemarkId(remarkId);
      let response;
      switch (newStatus) {
        case 'IN_PROGRESS':
          response = await fetchData(`contracts/remarks/${remarkId}/in-progress`, 'PUT');
          break;
        case 'DONE':
          response = await fetchData(`contracts/remarks/${remarkId}/done`, 'PUT');
          break;
        case 'CANCEL':
          response = await fetchData(`contracts/remarks/${remarkId}/cancel`, 'PUT');
          break;
        default:
          console.error('Unknown status:', newStatus);
          return;
      }
      
      if (response) {
        refetchRemarks();
        onRemarkChange?.();
      }
    } catch (error) {
      console.error('Error updating remark status:', error);
      setSnackbar({
        open: true,
        message: t('remarks.error.update'),
        severity: 'error'
      });
    } finally {
      setLoadingRemarkId(null);
    }
  };

  const handleAddRemark = async (newRemark) => {
    try {
      const addRemarkDto = {
        contractId,
        remarkType: getRemarkType(stepId),
        title: newRemark.title,
        description: newRemark.description,
        assignedTo: newRemark.assignedTo,
        ...(newRemark.deadline && {
          deadline: formatDateToInstant(newRemark.deadline)
        })
      };

      // Nie wysyłaj requestu jeśli deadline jest nieprawidłowy
      if (newRemark.deadline && !addRemarkDto.deadline) {
        setSnackbar({
          open: true,
          message: t('remarks.error.invalidDate'),
          severity: 'error'
        });
        return;
      }

      const response = await fetchData('contracts/remarks/', 'POST', addRemarkDto);
      
      if (response) {
        refetchRemarks();
        onRemarkChange?.();
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding remark:', error);
      setSnackbar({
        open: true,
        message: t('remarks.error.add'),
        severity: 'error'
      });
    }
  };

  const handleEdit = (remark) => {
    setEditedRemark(remark);
  };

  const handleSaveEdit = async (updatedRemark) => {
    try {
      const editRemarkDto = {
        remarkId: updatedRemark.remarkId,
        title: updatedRemark.title,
        description: updatedRemark.description,
        assignedTo: updatedRemark.assignedTo,
        ...(updatedRemark.deadline && {
          deadline: formatDateToInstant(updatedRemark.deadline)
        })
      };

      // Nie wysyłaj requestu jeśli deadline jest nieprawidłowy
      if (updatedRemark.deadline && !editRemarkDto.deadline) {
        setSnackbar({
          open: true,
          message: t('remarks.error.invalidDate'),
          severity: 'error'
        });
        return;
      }

      const response = await fetchData('contracts/remarks/edit', 'PUT', editRemarkDto);
      if (response) {
        refetchRemarks();
        onRemarkChange?.();
        setEditedRemark(null);
      }
    } catch (error) {
      console.error('Error updating remark:', error);
      setSnackbar({
        open: true,
        message: t('remarks.error.update'),
        severity: 'error'
      });
    }
  };

  const sortedRemarks = remarks ? [...remarks].sort((a, b) => {
    const statusDiff = getStatusPriority(a.remarkStatus) - getStatusPriority(b.remarkStatus);
    if (statusDiff !== 0) return statusDiff;

    return new Date(a.deadline) - new Date(b.deadline);
  }) : [];

  if (error) return <div>Wystąpił błąd: {error.message}</div>;

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

      {isPending ? (
        <div className="remarks-loading">
          <Typography variant="body2">
            {t('remarks.loading')}
          </Typography>
        </div>
      ) : (!remarks || remarks.length === 0) ? (
        <div className="empty-remarks">
          <Typography variant="body2">
            {t('remarks.noRemarks')}
          </Typography>
        </div>
      ) : (
        sortedRemarks.map(remark => (
          <RemarkCard
            key={remark.id}
            remark={remark}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            isLoading={loadingRemarkId === remark.remarkId}
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

      <SnackbarAlert
        open={snackbar.open}
        handleClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
};

export default RemarksContent; 