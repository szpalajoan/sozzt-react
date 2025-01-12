import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, TextField, Button, List, ListItem, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AttachFile, Add, Check, Close } from '@mui/icons-material';
import useDataFetching from '../../useDataFetching';

const ConsentsCollection = ({ contractId }) => {
    const { t } = useTranslation();
    const [newConsent, setNewConsent] = useState({ ownerName: '', plotNumber: '', comment: '', collectorName: '' });
    const [consents, setConsents] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentConsent, setCurrentConsent] = useState(null);
    const [actionType, setActionType] = useState('');
    const [statusComment, setStatusComment] = useState('');

    const { fetchData } = useDataFetching('contracts/consents/');

    const collectors = ['Ania', 'Kasia', 'Basia'];
    useEffect(() => {
        fetchConsents();
    }, [contractId]);

    const fetchConsents = async () => {
        try {
            const response = await fetchData(`contracts/consents/${contractId}`);
            setConsents(response.privatePlotOwnerConsents);

            if (!newConsent.collectorName && response.privatePlotOwnerConsents && response.privatePlotOwnerConsents.length > 0) {
                const firstCollector = response.privatePlotOwnerConsents[0].collectorName;
                console.log("firstCollector: " + firstCollector);
                setNewConsent(prev => ({ ...prev, collectorName: firstCollector }));
            }
        } catch (error) {
            console.error('Error fetching consents:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setNewConsent({ ...newConsent, [field]: value });
    };

    const addNewConsent = async () => {
        if (newConsent.ownerName && newConsent.plotNumber) {
            try {
                const addPrivatePlotOwnerConsentDto = {
                    ownerName: newConsent.ownerName,
                    plotNumber: newConsent.plotNumber,
                    comment: newConsent.comment,
                    collectorName: newConsent.collectorName
                };
                console.log("newConsent: " + newConsent.collectorName);
                console.log("addPrivatePlotOwnerConsentDto : " + addPrivatePlotOwnerConsentDto.collectorName);

                await fetchData(`contracts/consents/${contractId}/private-plot-owner-consent`, 'POST', addPrivatePlotOwnerConsentDto);
                fetchConsents();
                // Clear all fields except collectorName
                setNewConsent(prev => ({ ownerName: '', plotNumber: '', comment: '', collectorName: prev.collectorName }));
            } catch (error) {
                console.error('Error adding new consent:', error);
            }
        }
    };



    const handleConsentUpdate = async (consentId, field, value) => {
        try {
            await fetchData(`${contractId}/private-plot-owner-consent/${consentId}`, 'PUT', { [field]: value });
            fetchConsents();
        } catch (error) {
            console.error('Error updating consent:', error);
        }
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
        setStatusComment('');
    };

    const handleStatusChange = async (newStatus) => {
        if (!statusComment) {
            alert(t('consentsCollection.statusCommentRequired'));
            return;
        }
        try {
            await fetchData(`${contractId}/private-plot-owner-consent/${currentConsent.privatePlotOwnerConsentId}/status`, 'PUT', {
                consentStatus: newStatus,
                statusComment: statusComment
            });
            fetchConsents();
            closeDialog();
        } catch (error) {
            console.error('Error changing consent status:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box className="main-content">
                <h2 className="section-title">{t('consentsCollection.title')}</h2>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                        label={t('consentsCollection.ownerName')}
                        value={newConsent.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label={t('consentsCollection.plotNumber')}
                        value={newConsent.plotNumber}
                        onChange={(e) => handleInputChange('plotNumber', e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label={t('consentsCollection.comment')}
                        value={newConsent.comment}
                        onChange={(e) => handleInputChange('comment', e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <FormControl sx={{ mr: 2, minWidth: 120 }}>
                        <InputLabel id="collector-select-label">{t('consentsCollection.collectorName')}</InputLabel>
                        <Select
                            labelId="collector-select-label"
                            value={newConsent.collectorName}
                            onChange={(e) => handleInputChange('collectorName', e.target.value)}
                            label={t('consentsCollection.collectorName')}
                        >
                            {collectors.map((collector) => (
                                <MenuItem key={collector} value={collector}>{collector}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                {consents.map((consent) => (
                    <ListItem key={consent.privatePlotOwnerConsentId} className="main-content" sx={{ flexDirection: 'column', alignItems: 'flex-start', padding: 2 }}>
                        <h2 className="section-title">{consent.plotNumber} - {consent.ownerName}</h2>
                        <Typography>{t('consentsCollection.status')}: {t(`consentsCollection.${consent.consentStatus}`)}</Typography>
                        <Typography>{t('consentsCollection.createDate')}: {new Date(consent.consentCreateDate).toLocaleDateString()}</Typography>
                        {consent.comment && (
                            <Typography>{t('consentsCollection.comment')}: {consent.comment}</Typography>
                        )}
                        <Typography>{t('consentsCollection.collectorName')}: {consent.collectorName}</Typography>

                        {consent.consentStatus === 'CONSENT_CREATED' && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button
                                    startIcon={<Check />}
                                    onClick={() => openDialog(consent, 'SENT')}
                                    variant="contained"
                                    color="primary"
                                >
                                    {t('consentsCollection.markAsSent')}
                                </Button>
                                <Button
                                    startIcon={<Close />}
                                    onClick={() => openDialog(consent, 'INVALIDATED')}
                                    variant="contained"
                                    color="error"
                                >
                                    {t('consentsCollection.invalidate')}
                                </Button>
                            </Box>
                        )}

                        {consent.consentStatus === 'SENT' && (
                            <Button
                                startIcon={<Check />}
                                onClick={() => openDialog(consent, 'CONSENT_GIVEN')}
                                variant="contained"
                                color="success"
                            >
                                {t('consentsCollection.markAsGiven')}
                            </Button>
                        )}

                        {consent.statusComment && (
                            <Typography>{t('consentsCollection.statusComment')}: {consent.statusComment}</Typography>
                        )}
                    </ListItem>
                ))}
            </List>

            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>
                    {t(`consentsCollection.${actionType}`)}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('consentsCollection.statusComment')}
                        type="text"
                        fullWidth
                        value={statusComment}
                        onChange={(e) => setStatusComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>{t('cancel')}</Button>
                    <Button onClick={() => handleStatusChange(actionType)} color="primary">
                        {t('confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ConsentsCollection;

