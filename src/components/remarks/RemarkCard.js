import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  PersonOutline as PersonIcon, 
  CalendarToday as CalendarIcon 
} from '@mui/icons-material';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { STATUS_COLORS, STATUS_LABELS } from './remarksConstants';

const RemarkCard = ({ remark, onStatusChange, onEdit, isLoading }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    handleClose();
    if (action === 'edit') {
      onEdit(remark);
    } else if (action === 'cancel') {
      onStatusChange(remark.remarkId, 'CANCEL');
    }
  };

  const getCardClassName = () => {
    if (remark.remarkStatus === 'DONE') return 'remark-card';
    
    const now = new Date();
    const deadline = new Date(remark.deadline);
    const oneDayBefore = addDays(deadline, -1);

    if (isAfter(now, deadline)) {
      return 'remark-card remark-card-overdue';
    }
    if (isAfter(now, oneDayBefore)) {
      return 'remark-card remark-card-urgent';
    }
    return 'remark-card';
  };

  return (
    <Card className={getCardClassName()}>
      <CardContent>
        <div className="remark-card-header">
          <div className="remark-header-left">
            <Chip 
              label={t(STATUS_LABELS[remark.remarkStatus])} 
              color={STATUS_COLORS[remark.remarkStatus]} 
              size="small"
              className="status-chip"
            />
            <div className="remark-title-section">
              <Typography className="remark-title">{remark.title}</Typography>
            </div>
          </div>
          <div className="remark-actions">
            {remark.remarkStatus === 'NEW' && (
              <Button 
                variant="contained" 
                size="small" 
                onClick={() => onStatusChange(remark.remarkId, 'IN_PROGRESS')}
                disabled={isLoading}
                startIcon={isLoading && <CircularProgress size={16} color="inherit" />}
              >
                {t('remarks.actions.start')}
              </Button>
            )}
            {remark.remarkStatus === 'IN_PROGRESS' && (
              <Button 
                variant="contained" 
                color="success" 
                size="small" 
                onClick={() => onStatusChange(remark.remarkId, 'DONE')}
                disabled={isLoading}
                startIcon={isLoading && <CircularProgress size={16} color="inherit" />}
              >
                {t('remarks.actions.complete')}
              </Button>
            )}
            {remark.remarkStatus !== 'DONE' && remark.remarkStatus !== 'CANCELLED' && (
              <>
                <IconButton
                  size="small"
                  onClick={handleClick}
                  className="more-options-button"
                  disabled={isLoading}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem 
                    onClick={() => handleMenuAction('edit')}
                    disabled={isLoading}
                  >
                    {t('remarks.actions.edit')}
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleMenuAction('cancel')}
                    className="cancel-menu-item"
                    disabled={isLoading}
                  >
                    {t('remarks.actions.cancel')}
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>

        <Typography className="remark-description">
          {remark.description.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < remark.description.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </Typography>
        
        <div className="remark-footer">
          <div className="remark-metadata-row">
            <div className="remark-metadata-group">
              <PersonIcon fontSize="small" />
              <span>{remark.assignedTo}</span>
              <span className="metadata-separator">•</span>
              <CalendarIcon fontSize="small" />
              <span>{format(new Date(remark.deadline), 'dd.MM.yyyy, HH:mm', { locale: pl })}</span>
              <span className="metadata-separator">•</span>
              <span className="remark-creation-info">
                {t('remarks.metadata.created')}: {format(new Date(remark.createdAt), 'dd.MM.yyyy, HH:mm', { locale: pl })} - {remark.createdBy}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RemarkCard; 