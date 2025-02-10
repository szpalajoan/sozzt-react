import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, PersonOutline as PersonIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import './Remarks.css';
import { useTranslation } from 'react-i18next';

const MOCK_USERS = [
  { id: 1, name: "Anna Nowak" },
  { id: 2, name: "Jan Kowalski" },
  { id: 3, name: "Piotr Wiśniewski" },
  { id: 4, name: "Maria Dąbrowska" },
  { id: 5, name: "Tomasz Lewandowski" }
];

const MOCK_REMARKS = [
  {
    id: 1,
    title: "Brakujące pomiary",
    description: "Należy uzupełnić pomiary w sekcji północnej",
    status: "NEW",
    createdBy: "Jan Kowalski",
    assignedTo: "Anna Nowak",
    createdAt: "2024-03-20T10:00:00Z",
    deadline: "2024-03-25T10:00:00Z",
    stepId: "PRELIMINARY_PLAN"
  },
  {
    id: 2,
    title: "Nieprawidłowe oznaczenia",
    description: "Proszę poprawić oznaczenia na mapie zgodnie ze standardem",
    status: "IN_PROGRESS",
    createdBy: "Anna Nowak",
    createdAt: "2024-03-19T15:30:00Z",
    deadline: "2024-03-23T15:30:00Z",
    stepId: "PRELIMINARY_PLAN"
  }
];

const STATUS_COLORS = {
  NEW: 'error',
  IN_PROGRESS: 'warning',
  DONE: 'success',
  CANCELLED: 'default'
};

const STATUS_LABELS = {
  NEW: 'remarks.status.new',
  IN_PROGRESS: 'remarks.status.inProgress',
  DONE: 'remarks.status.done',
  CANCELLED: 'remarks.status.cancelled'
};

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

const RemarkCard = ({ remark, onStatusChange, onEdit }) => {
  const { t } = useTranslation();
  
  const handleStatusChange = (newStatus) => {
    onStatusChange(remark.id, newStatus);
  };

  return (
    <Card className="remark-card">
      <CardContent>
        <div className="remark-card-header">
          <div className="remark-header-left">
            <Chip 
              label={t(STATUS_LABELS[remark.status])} 
              color={STATUS_COLORS[remark.status]} 
              size="small"
              className="status-chip"
            />
            <div className="remark-title-section">
              <Typography className="remark-title">{remark.title}</Typography>
              <IconButton 
                size="small" 
                onClick={() => onEdit(remark)}
                className="edit-button"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
          <div className="remark-actions">
            {remark.status === 'NEW' && (
              <Button 
                variant="contained" 
                size="small" 
                onClick={() => handleStatusChange('IN_PROGRESS')}
              >
                {t('remarks.actions.start')}
              </Button>
            )}
            {remark.status === 'IN_PROGRESS' && (
              <Button 
                variant="contained" 
                color="success" 
                size="small" 
                onClick={() => handleStatusChange('DONE')}
              >
                {t('remarks.actions.complete')}
              </Button>
            )}
          </div>
        </div>

        <div className="remark-metadata-row">
          <div className="remark-metadata-group">
            <PersonIcon fontSize="small" />
            <span>{remark.assignedTo}</span>
            <span className="metadata-separator">•</span>
            <CalendarIcon fontSize="small" />
            <span>{format(new Date(remark.deadline), 'dd.MM.yyyy, HH:mm', { locale: pl })}</span>
          </div>
        </div>

        <Typography className="remark-description">{remark.description}</Typography>
        
        <Typography 
          className="remark-creation-info" 
          sx={{ 
            fontSize: '0.7rem',
            color: '#999',
            marginTop: '12px'
          }}
        >
          Utworzono: {format(new Date(remark.createdAt), 'dd.MM.yyyy, HH:mm', { locale: pl })} - {remark.createdBy}
        </Typography>
      </CardContent>
    </Card>
  );
};

const AddRemarkDialog = ({ open, onClose, onAdd }) => {
  const { t } = useTranslation();
  const [newRemark, setNewRemark] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: ''
  });

  const handleAdd = () => {
    onAdd({
      ...newRemark,
      status: 'NEW',
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    });
    onClose();
    setNewRemark({ title: '', description: '', deadline: '', assignedTo: '' });
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
        {t('remarks.dialog.title')}
      </DialogTitle>
      <DialogContent className="remark-dialog-content">
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
          disabled={!newRemark.title || !newRemark.description || !newRemark.deadline || !newRemark.assignedTo}
        >
          {t('remarks.dialog.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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