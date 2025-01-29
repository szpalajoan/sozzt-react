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
    MenuItem,
    Typography
} from '@mui/material';
import { AttachFile } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ApproveDialog = ({ 
    open, 
    consent, 
    onClose, 
    onApprove,
    onUploadFile, 
    type = 'private'
}) => {
    const { t } = useTranslation();
    const [deliveryType, setDeliveryType] = useState('');
    const [approveComment, setApproveComment] = useState('');
    const [mailingDate, setMailingDate] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const deliveryTypes = ['EMAIL', 'POST', 'PERSONAL_VISIT'];

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
                collectorName: consent.collectorName,
                comment: approveComment,
                deliveryType: deliveryType,
                mailingDate: mailingDate ? new Date(mailingDate).toISOString() : null
            };

            const consentId = type === 'private' 
                ? consent.privatePlotOwnerConsentId 
                : consent.publicPlotOwnerConsentId;

            await onApprove(consentId, updateDto);

            if (selectedFile) {
                await onUploadFile(consentId, selectedFile, type);
            }

            handleClose();
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
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {`${consent.plotNumber} - ${consent.ownerName}`}
            </DialogTitle>
            <DialogContent>
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
                                {t(`consentsCollection.${type}`)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {(deliveryType === 'EMAIL' || deliveryType === 'POST') && (
                    <TextField
                        margin="normal"
                        label={t('consentsCollection.mailingDate')}
                        type="date"
                        fullWidth
                        value={mailingDate || ''}
                        onChange={(e) => setMailingDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                )}

                <TextField
                    margin="normal"
                    label={t('consentsCollection.comment')}
                    type="text"
                    fullWidth
                    value={approveComment}
                    onChange={(e) => setApproveComment(e.target.value)}
                />

                <input
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <label htmlFor="raised-button-file">
                    <Button 
                        variant="outlined" 
                        component="span" 
                        startIcon={<AttachFile />}
                        sx={{ mt: 2 }}
                    >
                        {t('consentsCollection.attachFile')}
                    </Button>
                </label>
                {selectedFile && (
                    <Typography sx={{ mt: 1 }}>{selectedFile.name}</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button onClick={handleApprove} color="primary">
                    {t('consentsCollection.approve')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApproveDialog; 