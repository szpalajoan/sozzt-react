import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem
} from '@mui/material';
import { AttachFile } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import '../styles/ApproveDialog.css';

const PublicApproveDialog = ({ 
    open, 
    consent, 
    onClose, 
    onApprove,
    onUploadFile,
    onComplete
}) => {
    const { t } = useTranslation();
    const [deliveryType, setDeliveryType] = useState('');
    const [approveComment, setApproveComment] = useState('');
    const [mailingDate, setMailingDate] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const deliveryTypes = ['PERSONAL_VISIT', 'EMAIL', 'POST'];

    const handleApprove = async () => {
        if (!deliveryType) {
            alert(t('consentsCollection.deliveryTypeRequired'));
            return;
        }

        if ((deliveryType === 'EMAIL' || deliveryType === 'POST') && !mailingDate) {
            alert(t('consentsCollection.mailingDateRequired'));
            return;
        }

        if (!selectedFile) {
            alert(t('consentsCollection.fileRequired'));
            return;
        }

        try {
            const updateDto = {
                ownerName: consent.ownerName,
                plotNumber: consent.plotNumber,
                comment: approveComment,
                deliveryType: deliveryType,
                mailingDate: new Date(mailingDate).toISOString()
            };

            await onApprove(consent.publicPlotOwnerConsentId, updateDto);
            
            if (selectedFile) {
                await onUploadFile(consent.publicPlotOwnerConsentId, selectedFile);
            }

            handleClose();
            if (onComplete) {
                await onComplete();
            }
        } catch (error) {
            console.error('Error approving consent:', error);
        }
    };

    const handleClose = () => {
        setDeliveryType('');
        setApproveComment('');
        setMailingDate(null);
        setSelectedFile(null);
        onClose();
    };

    if (!consent) return null;

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            classes={{ paper: 'approve-dialog' }}
        >
            <DialogTitle className="approve-dialog-title">
                {`${consent.plotNumber} - ${consent.ownerName}`}
            </DialogTitle>
            <DialogContent className="approve-dialog-content">
                <FormControl fullWidth margin="normal">
                    <InputLabel id="delivery-type-label">
                        {t('consentsCollection.deliveryType')}
                    </InputLabel>
                    <Select
                        labelId="delivery-type-label"
                        value={deliveryType}
                        onChange={(e) => setDeliveryType(e.target.value)}
                        label={t('consentsCollection.deliveryType')}
                    >
                        {deliveryTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {t(`consentsCollection.deliveryTypes.${type}`)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {(deliveryType === 'EMAIL' || deliveryType === 'POST') && (
                    <TextField
                        fullWidth
                        margin="normal"
                        label={t('consentsCollection.mailingDate')}
                        type="date"
                        value={mailingDate || ''}
                        onChange={(e) => setMailingDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                )}

                <TextField
                    fullWidth
                    margin="normal"
                    label={t('consentsCollection.comment')}
                    value={approveComment}
                    onChange={(e) => setApproveComment(e.target.value)}
                    multiline
                    rows={4}
                />

                <input
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    id="consent-file"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <label htmlFor="consent-file">
                    <Button
                        component="span"
                        startIcon={<AttachFile />}
                        className="file-upload-button"
                    >
                        {selectedFile ? selectedFile.name : t('consentsCollection.attachFile')}
                    </Button>
                </label>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    {t('common.cancel')}
                </Button>
                <Button onClick={handleApprove} variant="contained" color="primary">
                    {t('consentsCollection.approve')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PublicApproveDialog; 