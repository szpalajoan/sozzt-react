import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { MOCK_USERS } from './remarksConstants';

const EditRemarkDialog = ({ open, onClose, onSave, remark }) => {
  const { t } = useTranslation();
  const [editedRemark, setEditedRemark] = useState({
    title: remark?.title || '',
    description: remark?.description || '',
    assignedTo: remark?.assignedTo || '',
    deadline: remark?.deadline ? format(new Date(remark.deadline), "yyyy-MM-dd'T'HH:mm") : ''
  });

  const handleSave = () => {
    onSave({ ...remark, ...editedRemark });
    onClose();
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
        {t('remarks.edit.title')}
      </DialogTitle>
      <DialogContent className="remark-dialog-content">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label={t('remarks.dialog.titleField')}
            value={editedRemark.title}
            onChange={(e) => setEditedRemark({ ...editedRemark, title: e.target.value })}
            fullWidth
            className="remark-form-field"
          />
          <TextField
            label={t('remarks.dialog.descriptionField')}
            value={editedRemark.description}
            onChange={(e) => setEditedRemark({ ...editedRemark, description: e.target.value })}
            multiline
            rows={4}
            fullWidth
            className="remark-form-field"
          />
          <TextField
            select
            label={t('remarks.edit.assignedTo')}
            value={editedRemark.assignedTo}
            onChange={(e) => setEditedRemark({ ...editedRemark, assignedTo: e.target.value })}
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
            value={editedRemark.deadline}
            onChange={(e) => setEditedRemark({ ...editedRemark, deadline: e.target.value })}
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
          onClick={handleSave} 
          variant="contained"
          disabled={!editedRemark.title || !editedRemark.description || !editedRemark.deadline || !editedRemark.assignedTo}
        >
          {t('remarks.edit.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRemarkDialog; 