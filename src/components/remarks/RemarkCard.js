import React from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Chip,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, PersonOutline as PersonIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { STATUS_COLORS, STATUS_LABELS } from './remarksConstants';

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
        
        <Typography className="remark-creation-info">
          Utworzono: {format(new Date(remark.createdAt), 'dd.MM.yyyy, HH:mm', { locale: pl })} - {remark.createdBy}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RemarkCard; 