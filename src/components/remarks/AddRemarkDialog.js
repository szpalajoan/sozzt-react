import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MOCK_USERS } from './remarksConstants';

const AddRemarkDialog = ({ open, onClose, onAdd, steps, showStepSelect }) => {
  const { t } = useTranslation();
  const [newRemark, setNewRemark] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: '',
    selectedStep: ''
  });

  const handleAdd = () => {
    if (showStepSelect && !newRemark.selectedStep) {
      alert(t('remarks.selectStep'));
      return;
    }

    onAdd(newRemark);
    setNewRemark({ 
      title: '', 
      description: '', 
      deadline: '', 
      assignedTo: '',
      selectedStep: ''
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      className="remark-dialog"
    >
      <DialogTitle className="remark-dialog-title">
        {t('remarks.add')}
      </DialogTitle>
      <DialogContent className="remark-dialog-content">
        {showStepSelect && (
          <TextField
            select
            label={t('remarks.step')}
            value={newRemark.selectedStep}
            onChange={(e) => setNewRemark(prev => ({ ...prev, selectedStep: e.target.value }))}
            fullWidth
            required
            className="remark-form-field"
            sx={{ mb: 2, mt: 1 }}
          >
            {steps?.map((step) => (
              <MenuItem key={step.contractStepType} value={step.contractStepType}>
                {t(`steps.${step.contractStepType}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label={t('remarks.dialog.titleField')}
            value={newRemark.title}
            onChange={(e) => setNewRemark({ ...newRemark, title: e.target.value })}
            fullWidth
            className="remark-form-field"
          />
          <TextField
            label={t('remarks.dialog.descriptionField')}
            value={newRemark.description}
            onChange={(e) => setNewRemark({ ...newRemark, description: e.target.value })}
            multiline
            rows={4}
            fullWidth
            className="remark-form-field"
          />
          <TextField
            select
            label={t('remarks.edit.assignedTo')}
            value={newRemark.assignedTo}
            onChange={(e) => setNewRemark({ ...newRemark, assignedTo: e.target.value })}
            fullWidth
            className="remark-form-field"
          >
            {MOCK_USERS.map((user) => (
              <MenuItem key={user.id} value={user.name}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('remarks.dialog.deadlineField')}
            type="datetime-local"
            value={newRemark.deadline}
            onChange={(e) => setNewRemark({ ...newRemark, deadline: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            className="remark-form-field"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} sx={{ color: '#94a3b8' }}>
          {t('remarks.dialog.cancel')}
        </Button>
        <Button 
          onClick={handleAdd} 
          variant="contained"
          disabled={!newRemark.title || !newRemark.description}
        >
          {t('remarks.dialog.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRemarkDialog; 