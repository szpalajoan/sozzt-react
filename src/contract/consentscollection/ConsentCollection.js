import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, TextField, Button, List, ListItem, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AttachFile, Add, Check, Close } from '@mui/icons-material';

const ConsentsCollection = () => {
    const { t } = useTranslation();
    const [newConsent, setNewConsent] = useState({ name: '', plotNumber: '' });
    const [consents, setConsents] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentConsent, setCurrentConsent] = useState(null);
    const [actionType, setActionType] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    const handleInputChange = (field, value) => {
        setNewConsent({ ...newConsent, [field]: value });
    };

    const addNewConsent = () => {
        if (newConsent.name && newConsent.plotNumber) {
            setConsents([...consents, { 
                ...newConsent, 
                status: 'pending', 
                attachment: null, 
                acceptanceType: '', 
                acceptanceDate: '',
                createDate: new Date().toLocaleDateString() // Dodaj tę linię
            }]);
            setNewConsent({ name: '', plotNumber: '' });
        }
    };


    const handleConsentUpdate = (index, field, value) => {
        const updatedConsents = [...consents];
        updatedConsents[index][field] = value;
        setConsents(updatedConsents);
    };

    const openDialog = (consent, type) => {
        setCurrentConsent(consent);
        setActionType(type);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setCurrentConsent(null);
        setActionType('');
        setRejectionReason('');
    };

    const handleAccept = () => {
        if (!currentConsent.acceptanceType || !currentConsent.acceptanceDate || !currentConsent.attachment) {
            alert(t('consentsCollection.acceptanceDetailsRequired'));
            return;
        }
        const updatedConsents = consents.map(c => 
            c === currentConsent ? { ...c, status: 'accepted' } : c
        );
        setConsents(updatedConsents);
        closeDialog();
    };

    const handleReject = () => {
        if (!rejectionReason) {
            alert(t('consentsCollection.rejectionReasonRequired'));
            return;
        }
        const updatedConsents = consents.map(c => 
            c === currentConsent ? { ...c, status: 'rejected', rejectionReason } : c
        );
        setConsents(updatedConsents);
        closeDialog();
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box className="main-content">
                <h2 className="section-title">{t('consentsCollection.title')}</h2>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                        label={t('consentsCollection.name')}
                        value={newConsent.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label={t('consentsCollection.plotNumber')}
                        value={newConsent.plotNumber}
                        onChange={(e) => handleInputChange('plotNumber', e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <Button
                        startIcon={<Add />}
                        onClick={addNewConsent}
                        variant="contained"
                    >
                        {t('consentsCollection.add')}
                    </Button>
                </Box>
            </Box>

            <List sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {consents.map((consent, index) => (
                    <ListItem key={index} className="main-content" sx={{ flexDirection: 'column', alignItems: 'flex-start', padding: 2 }}>
                        <h2 className="section-title">{consent.plotNumber} - {consent.name}</h2>
                        <Typography>{t('consentsCollection.status')}: {t(`consentsCollection.${consent.status}`)}</Typography>
                        <Typography>{t('consentsCollection.createDate')}: {consent.createDate}</Typography>

                        {consent.status === 'pending' && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FormControl sx={{ minWidth: 120 }}>
                                    <InputLabel>{t('consentsCollection.acceptanceType')}</InputLabel>
                                    <Select
                                        value={consent.acceptanceType}
                                        onChange={(e) => handleConsentUpdate(index, 'acceptanceType', e.target.value)}
                                        label={t('consentsCollection.acceptanceType')}
                                    >
                                        <MenuItem value="email">{t('consentsCollection.email')}</MenuItem>
                                        <MenuItem value="inPerson">{t('consentsCollection.inPerson')}</MenuItem>
                                        <MenuItem value="mail">{t('consentsCollection.mail')}</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label={t('consentsCollection.acceptanceDate')}
                                    type="date"
                                    value={consent.acceptanceDate}
                                    onChange={(e) => handleConsentUpdate(index, 'acceptanceDate', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <input
                                    accept="image/*,application/pdf"
                                    style={{ display: 'none' }}
                                    id={`attachment-button-${index}`}
                                    type="file"
                                    onChange={(e) => handleConsentUpdate(index, 'attachment', e.target.files[0])}
                                />
                                <label htmlFor={`attachment-button-${index}`}>
                                    <Button component="span" startIcon={<AttachFile />}>
                                        {t('consentsCollection.attachFile')}
                                    </Button>
                                </label>
                                {consent.attachment && (
                                    <Typography variant="body2">
                                        {consent.attachment.name}
                                    </Typography>
                                )}
                                <Button
                                    startIcon={<Check />}
                                    onClick={() => openDialog(consent, 'accept')}
                                    variant="contained"
                                    color="success"
                                >
                                    {t('consentsCollection.accept')}
                                </Button>
                                <Button
                                    startIcon={<Close />}
                                    onClick={() => openDialog(consent, 'reject')}
                                    variant="contained"
                                    color="error"
                                >
                                    {t('consentsCollection.reject')}
                                </Button>
                            </Box>
                        )}

                        {consent.status === 'rejected' && (
                            <Typography>{t('consentsCollection.rejectionReason')}: {consent.rejectionReason}</Typography>
                        )}
                    </ListItem>
                ))}
            </List>

            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>
                    {actionType === 'accept' 
                        ? t('consentsCollection.acceptanceDetails')
                        : t('consentsCollection.rejectionDetails')
                    }
                </DialogTitle>
                <DialogContent>
                    {actionType === 'accept' ? (
                        <Typography>{t('consentsCollection.provideAcceptanceDetails')}</Typography>
                    ) : (
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t('consentsCollection.rejectionReason')}
                            type="text"
                            fullWidth
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>{t('cancel')}</Button>
                    <Button onClick={actionType === 'accept' ? handleAccept : handleReject} color="primary">
                        {actionType === 'accept' ? t('consentsCollection.accept') : t('consentsCollection.reject')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ConsentsCollection;

