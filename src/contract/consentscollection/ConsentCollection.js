import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, TextField, Button, List, ListItem, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Tabs, Tab } from '@mui/material';
import { AttachFile, Add, Check, Close } from '@mui/icons-material';
import useDataFetching from '../../useDataFetching';
import FileLink from '../FileLink';
import useFetch from "../../useFetch";


import { renderTextFields } from '../renderTextFields';

const ConsentsCollection = ({ contractId }) => {
    const { t } = useTranslation();
    const [newConsent, setNewConsent] = useState({ ownerName: '', plotNumber: '', comment: '', collectorName: '' });
    const [consents, setConsents] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentConsent, setCurrentConsent] = useState(null);
    const [actionType, setActionType] = useState('');
    const [statusComment, setStatusComment] = useState('');
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [deliveryType, setDeliveryType] = useState('');
    const [approveComment, setApproveComment] = useState('');
    const [mailingDate, setMailingDate] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [newPublicConsent, setNewPublicConsent] = useState({ ownerName: '', plotNumber: '', comment: '', collectorName: '' });
    const [publicConsents, setPublicConsents] = useState([]);

    const { data: fetchedFiles, isPending: isFilesPending, refetch: refetchFiles } = useFetch(`contracts/${contractId}/files?fileType=PRIVATE_PLOT_OWNER_CONSENT_AGREEMENT`);
    const { data: publicFetchedFiles, isPending: isPublicFilesPending, refetch: refetchPublicFiles } = useFetch(`contracts/${contractId}/files?fileType=PUBLIC_OWNER_CONSENT_AGREEMENT`);


    const { fetchData } = useDataFetching('contracts/consents/');

    const collectors = ['Ania', 'Kasia', 'Basia'];
    const deliveryTypes = ['EMAIL', 'POST', 'PERSONAL_VISIT'];

    useEffect(() => {
        fetchConsents();

        console.log(fetchedFiles);
    }, [contractId]);

    const fetchConsents = async () => {
        try {
            const response = await fetchData(`contracts/consents/${contractId}`);
            setConsents(response.privatePlotOwnerConsents);
            setPublicConsents(response.publicOwnerConsents);

            if (!newConsent.collectorName && response.privatePlotOwnerConsents && response.privatePlotOwnerConsents.length > 0) {
                const firstCollector = response.privatePlotOwnerConsents[0].collectorName;
                setNewConsent(prev => ({ ...prev, collectorName: firstCollector }));
            }
        } catch (error) {
            console.error('Error fetching consents:', error);
        }
    };


    const handleInputChange = (field, value) => {
        setNewConsent({ ...newConsent, [field]: value });
    };

    const handlePublicInputChange = (field, value) => {
        setNewPublicConsent({ ...newPublicConsent, [field]: value });
    };

    const sortConsents = (consents) => {
        return consents.sort((a, b) => {
            if (a.consentStatus === 'CONSENT_CREATED' && b.consentStatus !== 'CONSENT_CREATED') return -1;
            if (a.consentStatus !== 'CONSENT_GIVEN' && b.consentStatus === 'CONSENT_GIVEN') return -1;
            return 0;
        });
    };

    const addNewConsent = async () => {
        if (newConsent.ownerName && newConsent.plotNumber) {
            try {
                const addPrivatePlotOwnerConsentDto = {
                    ownerName: newConsent.ownerName,
                    plotNumber: newConsent.plotNumber,
                    collectorName: newConsent.collectorName
                };
                console.log("newConsent: " + newConsent.collectorName);
                console.log("addPrivatePlotOwnerConsentDto : " + addPrivatePlotOwnerConsentDto.collectorName);

                await fetchData(`contracts/consents/${contractId}/private-plot-owner-consent`, 'POST', addPrivatePlotOwnerConsentDto);
                fetchConsents();
                setNewConsent(prev => ({ ownerName: '', plotNumber: '', comment: '', collectorName: prev.collectorName }));
            } catch (error) {
                console.error('Error adding new consent:', error);
            }
        }
    };

    const addNewPublicConsent = async () => {
        if (newPublicConsent.ownerName && newPublicConsent.plotNumber && newPublicConsent.mailingDate) {
            try {
                const addPublicPlotOwnerConsentDto = {
                    ownerName: newPublicConsent.ownerName,
                    plotNumber: newPublicConsent.plotNumber,
                };

                await fetchData(`contracts/consents/${contractId}/public-plot-owner-consent`, 'POST', addPublicPlotOwnerConsentDto);
                fetchConsents();
                setNewPublicConsent({ ownerName: '', plotNumber: '', mailingDate: '' });
            } catch (error) {
                console.error('Error adding new public consent:', error);
            }
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
            if (newStatus === 'INVALIDATED') {
                await invalidateConsent();
            } else {
                await fetchData(`${contractId}/private-plot-owner-consent/${currentConsent.privatePlotOwnerConsentId}/status`, 'PUT', {
                    consentStatus: newStatus,
                    statusComment: statusComment
                });
            }
            fetchConsents();
            closeDialog();
        } catch (error) {
            console.error('Error changing consent status:', error);
        }
    };

    const invalidateConsent = async () => {
        try {
            await fetchData(`contracts/consents/${contractId}/private-plot-owner-consent/${currentConsent.privatePlotOwnerConsentId}/invalidate`, 'PUT', {
                reason: statusComment
            });
        } catch (error) {
            console.error('Error invalidating consent:', error);
            throw error;
        }
    };



    const openApproveDialog = (consent) => {
        setCurrentConsent(consent);
        setApproveDialogOpen(true);
    };

    const closeApproveDialog = () => {
        setApproveDialogOpen(false);
        setCurrentConsent(null);
        setDeliveryType('');
        setApproveComment('');
        setSelectedFile(null);
    };

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
                ownerName: currentConsent.ownerName,
                plotNumber: currentConsent.plotNumber,
                collectorName: currentConsent.collectorName,
                comment: approveComment,
                deliveryType: deliveryType,
                mailingDate: mailingDate ? new Date(mailingDate).toISOString() : null
            };

            await fetchData(`contracts/consents/${contractId}/private-plot-owner-consent/${currentConsent.privatePlotOwnerConsentId}`, 'PUT', updateDto);
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                await fetchData(`contracts/consents/${contractId}/private-plot-owner-consent/${currentConsent.privatePlotOwnerConsentId}/agreement`, 'PUT', formData);
            }

            fetchConsents();
            closeApproveDialog();
        } catch (error) {
            console.error('Error approving consent:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label={t('consentsCollection.privateConsents')} />
                <Tab label={t('consentsCollection.publicConsents')} />
            </Tabs>

            {activeTab === 0 && (
                <Box>
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
                        {sortConsents([...consents]).map((consent) => (
                            <ListItem key={consent.privatePlotOwnerConsentId} className="main-content" sx={{ flexDirection: 'column', alignItems: 'flex-start', padding: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                                    <h2 className="section-title" style={{ marginRight: '10px', marginBottom: 0 }}>{consent.plotNumber} - {consent.ownerName}</h2>
                                    <Chip
                                        label={t(`consentsCollection.${consent.consentStatus}`)}
                                        color={
                                            consent.consentStatus === 'CONSENT_CREATED' || consent.consentStatus === 'SENT'
                                                ? 'primary'
                                                : consent.consentStatus === 'INVALIDATED'
                                                    ? 'error'
                                                    : consent.consentStatus === 'CONSENT_GIVEN'
                                                        ? 'success'
                                                        : 'default'
                                        }
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>
                                <Typography>{t('consentsCollection.createDate')}: {new Date(consent.consentCreateDate).toLocaleDateString()}</Typography>
                                {consent.comment && (
                                    <Typography>{t('consentsCollection.comment')}: {consent.comment}</Typography>
                                )}
                                <Typography>{t('consentsCollection.collectorName')}: {consent.collectorName}</Typography>

                                {consent.consentStatus === 'CONSENT_GIVEN' && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1">{t('consentsCollection.consentScan')}:</Typography>
                                        {fetchedFiles && fetchedFiles.find(file => file.additionalObjectId === consent.privatePlotOwnerConsentId) ? (
                                            <FileLink
                                                contractId={contractId}
                                                fileId={fetchedFiles.find(file => file.additionalObjectId === consent.privatePlotOwnerConsentId).fileId}
                                                fileName={fetchedFiles.find(file => file.additionalObjectId === consent.privatePlotOwnerConsentId).fileName}
                                            />
                                        ) : (
                                            <Typography variant="body2">{t('consentsCollection.noScanAvailable')}</Typography>
                                        )}
                                    </Box>
                                )}


                                {consent.consentStatus === 'CONSENT_CREATED' && (
                                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button
                                            startIcon={<Check />}
                                            onClick={() => openApproveDialog(consent)}
                                            variant="outlined"
                                            color="success"
                                            sx={{
                                                backgroundColor: 'white',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 200, 0, 0.04)'
                                                }
                                            }}
                                        >
                                            {t('consentsCollection.approve')}
                                        </Button>
                                        <Button
                                            startIcon={<Close />}
                                            onClick={() => openDialog(consent, 'INVALIDATED')}
                                            variant="outlined"
                                            color="error"
                                            sx={{
                                                backgroundColor: 'white',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(200, 0, 0, 0.04)'
                                                }
                                            }}
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
                </Box>
            )}

            {activeTab === 1 && (
                <Box>
                    <Box className="main-content">
                        <h2 className="section-title">{t('consentsCollection.publicConsentsTitle')}</h2>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                                label={t('consentsCollection.publicOwnerName')}
                                value={newPublicConsent.ownerName}
                                onChange={(e) => setNewPublicConsent({ ...newPublicConsent, ownerName: e.target.value })}
                                sx={{ mr: 2 }}
                            />
                            <TextField
                                label={t('consentsCollection.plotNumber')}
                                value={newPublicConsent.plotNumber}
                                onChange={(e) => setNewPublicConsent({ ...newPublicConsent, plotNumber: e.target.value })}
                                sx={{ mr: 2 }}
                            />
                            <TextField
                                label={t('consentsCollection.mailingDate')}
                                type="date"
                                value={newPublicConsent.mailingDate}
                                onChange={(e) => handlePublicInputChange('mailingDate', e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ mr: 2 }}
                            />
                            <Button
                                startIcon={<Add />}
                                onClick={addNewPublicConsent}
                                variant="contained"
                            >
                                {t('consentsCollection.add')}
                            </Button>
                        </Box>
                    </Box>

                    <List sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {sortConsents([...publicConsents]).map((consent) => (
                            <ListItem key={consent.publicPlotOwnerConsentId} className="main-content" sx={{ flexDirection: 'column', alignItems: 'flex-start', padding: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                                    <h2 className="section-title" style={{ marginRight: '10px', marginBottom: 0 }}>{consent.plotNumber} - {consent.ownerName}</h2>
                                    <Chip
                                        label={t(`consentsCollection.${consent.consentStatus}`)}
                                        color={
                                            consent.consentStatus === 'CONSENT_CREATED' || consent.consentStatus === 'SENT'
                                                ? 'primary'
                                                : consent.consentStatus === 'INVALIDATED'
                                                    ? 'error'
                                                    : consent.consentStatus === 'CONSENT_GIVEN'
                                                        ? 'success'
                                                        : 'default'
                                        }
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>
                                <Typography>{t('consentsCollection.createDate')}: {new Date(consent.consentCreateDate).toLocaleDateString()}</Typography>
                                {consent.comment && (
                                    <Typography>{t('consentsCollection.comment')}: {consent.comment}</Typography>
                                )}
                                <Typography>{t('consentsCollection.collectorName')}: {consent.collectorName}</Typography>

                                {(consent.consentStatus === 'CONSENT_GIVEN' || consent.consentStatus === 'INVALIDATED') && consent.consentGivenDate && (
                                    <Typography>
                                        {consent.consentStatus === 'INVALIDATED'
                                            ? t('consentsCollection.invalidationDate')
                                            : t('consentsCollection.consentGivenDate')}:
                                        {new Date(consent.consentGivenDate).toLocaleDateString()}
                                    </Typography>
                                )}

                                {consent.consentStatus === 'CONSENT_CREATED' && (
                                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button
                                            startIcon={<Check />}
                                            onClick={() => openApproveDialog(consent)}
                                            variant="outlined"
                                            color="success"
                                            sx={{
                                                backgroundColor: 'white',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 200, 0, 0.04)'
                                                }
                                            }}
                                        >
                                            {t('consentsCollection.approve')}
                                        </Button>
                                        <Button
                                            startIcon={<Close />}
                                            onClick={() => openDialog(consent, 'INVALIDATED')}
                                            variant="outlined"
                                            color="error"
                                            sx={{
                                                backgroundColor: 'white',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(200, 0, 0, 0.04)'
                                                }
                                            }}
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
                </Box>
            )}


            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>
                    {t(`consentsCollection.${actionType}`)}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={actionType === 'INVALIDATED' ? t('consentsCollection.invalidationReason') : t('consentsCollection.statusComment')}
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


            <Dialog open={approveDialogOpen} onClose={closeApproveDialog}>
                <DialogTitle>
                    {currentConsent && `${currentConsent.plotNumber} - ${currentConsent.ownerName}`}
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="delivery-type-label">{t('consentsCollection.deliveryType')}</InputLabel>
                        <Select
                            labelId="delivery-type-label"
                            value={deliveryType}
                            onChange={(e) => setDeliveryType(e.target.value)}
                            label={t('consentsCollection.deliveryType')}
                        >
                            {deliveryTypes.map((type) => (
                                <MenuItem key={type} value={type}>{t(`consentsCollection.${type}`)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {(deliveryType === 'EMAIL' || deliveryType === 'POST') && (
                        renderTextFields([
                            {
                                label: t('consentsCollection.mailingDate'),
                                name: "mailingDate",
                                value: mailingDate,
                                type: "date"
                            }
                        ], { mailingDate }, (e) => setMailingDate(e.target.value))
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
                        <Button variant="outlined" component="span" startIcon={<AttachFile />}>
                            {t('consentsCollection.attachFile')}
                        </Button>
                    </label>
                    {selectedFile && <Typography>{selectedFile.name}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeApproveDialog}>{t('cancel')}</Button>
                    <Button onClick={handleApprove} color="primary">
                        {t('consentsCollection.approve')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>


    );
};
export default ConsentsCollection;

