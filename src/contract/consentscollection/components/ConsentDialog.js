import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ConsentDialog = ({ open, onClose, onConfirm, actionType }) => {
    const { t } = useTranslation();
    const [comment, setComment] = useState('');

    const handleConfirm = () => {
        if (!comment) {
            alert(t('consentsCollection.statusCommentRequired'));
            return;
        }
        onConfirm(actionType, comment);
        setComment('');
    };

    const handleClose = () => {
        setComment('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {t(`consentsCollection.${actionType}`)}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={actionType === 'INVALIDATED' 
                        ? t('consentsCollection.invalidationReason') 
                        : t('consentsCollection.statusComment')}
                    type="text"
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button onClick={handleConfirm} color="primary">
                    {t('confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConsentDialog; 