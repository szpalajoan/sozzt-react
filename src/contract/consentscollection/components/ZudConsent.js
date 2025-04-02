import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Alert,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Check, Close } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useFetch from '../../../useFetch';

const MOCK_COLLECTORS = [
    { id: 1, name: 'Jan Kowalski' },
    { id: 2, name: 'Anna Nowak' },
    { id: 3, name: 'Piotr Wiśniewski' },
    { id: 4, name: 'Maria Wójcik' },
    { id: 5, name: 'Krzysztof Lewandowski' }
];

const getStatusColor = (status) => {
    switch (status) {
        case 'REQUIRED':
            return 'warning';
        case 'CONSENT_CREATED':
            return 'info';
        case 'SENT':
            return 'primary';
        case 'INVALIDATED':
            return 'error';
        case 'CONSENT_GIVEN':
            return 'success';
        default:
            return 'default';
    }
};

const ZudConsent = ({ contractId, zudConsent, onUpdateZudConsent, onMarkAsSentByMail, onAddAgreement, onInvalidate }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [invalidateDialogOpen, setInvalidateDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        institutionName: zudConsent?.institutionName || '',
        plotNumber: zudConsent?.plotNumber || '',
        comment: zudConsent?.comment || '',
        collectorName: zudConsent?.collectorName || '',
        mailingDate: zudConsent?.mailingDate ? new Date(zudConsent.mailingDate) : null,
        deliveryType: zudConsent?.deliveryType || 'NOT_SPECIFIED'
    });

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            mailingDate: date
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const submitData = {
                ...formData,
                mailingDate: formData.mailingDate || zudConsent?.mailingDate
            };
            await onUpdateZudConsent(submitData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setApproveDialogOpen(true);
        }
    };

    const handleApproveSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await onAddAgreement(selectedFile);
            setApproveDialogOpen(false);
            setSelectedFile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInvalidateSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await onInvalidate('Invalidated by user');
            setInvalidateDialogOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsSentByMail = async () => {
        setLoading(true);
        setError(null);
        try {
            await onMarkAsSentByMail();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box className="main-content">
                <h2 className="section-title">
                    {t('consentsCollection.zudConsent')}
                    <Chip 
                        label={t(`consentsCollection.${zudConsent?.consentStatus}`)}
                        color={getStatusColor(zudConsent?.consentStatus)}
                        size="small"
                        sx={{ ml: 2, verticalAlign: 'middle' }}
                    />
                </h2>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {t('consentsCollection.consentCreateDate')}: {new Date(zudConsent?.consentCreateDate).toLocaleString()}
                    </Typography>
                    {zudConsent?.mailingDate && (
                        <Typography variant="body2" color="text.secondary">
                            {t('consentsCollection.mailingDate')}: {new Date(zudConsent.mailingDate).toLocaleString()}
                        </Typography>
                    )}
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label={t('consentsCollection.institutionName')}
                            value={formData.institutionName}
                            onChange={handleInputChange('institutionName')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label={t('consentsCollection.plotNumber')}
                            value={formData.plotNumber}
                            onChange={handleInputChange('plotNumber')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label={t('consentsCollection.comment')}
                            value={formData.comment}
                            onChange={handleInputChange('comment')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>{t('consentsCollection.collectorName')}</InputLabel>
                            <Select
                                value={formData.collectorName}
                                onChange={handleInputChange('collectorName')}
                                label={t('consentsCollection.collectorName')}
                            >
                                <MenuItem value="">{t('consentsCollection.selectCollector')}</MenuItem>
                                {MOCK_COLLECTORS.map(collector => (
                                    <MenuItem key={collector.id} value={collector.name}>
                                        {collector.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>{t('consentsCollection.deliveryType')}</InputLabel>
                            <Select
                                value={formData.deliveryType}
                                onChange={handleInputChange('deliveryType')}
                                label={t('consentsCollection.deliveryType')}
                            >
                                <MenuItem value="NOT_SPECIFIED">{t('consentsCollection.deliveryTypeNotSpecified')}</MenuItem>
                                <MenuItem value="EMAIL">{t('consentsCollection.deliveryTypeEmail')}</MenuItem>
                                <MenuItem value="POST">{t('consentsCollection.deliveryTypePost')}</MenuItem>
                                <MenuItem value="PERSONAL_VISIT">{t('consentsCollection.deliveryTypePersonalVisit')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2, pt: 1 }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : t('consentsCollection.save')}
                    </Button>

                    {zudConsent?.consentStatus === 'REQUIRED' && (
                        <Button
                            variant="outlined"
                            onClick={handleMarkAsSentByMail}
                            disabled={loading}
                        >
                            {t('consentsCollection.markAsSentByMail')}
                        </Button>
                    )}

                    {zudConsent?.consentStatus === 'SENT' && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                startIcon={<Check />}
                                variant="outlined"
                                color="success"
                                component="label"
                                disabled={loading}
                                sx={{
                                    backgroundColor: 'white',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 200, 0, 0.04)'
                                    }
                                }}
                            >
                                {t('consentsCollection.uploadAgreement')}
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileSelect}
                                />
                            </Button>
                            <Button
                                startIcon={<Close />}
                                variant="outlined"
                                color="error"
                                onClick={() => setInvalidateDialogOpen(true)}
                                disabled={loading}
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
                </Box>
            </Box>

            {/* Dialog for file upload confirmation */}
            <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
                <DialogTitle>{t('consentsCollection.uploadAgreement')}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {selectedFile?.name}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApproveDialogOpen(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button 
                        onClick={handleApproveSubmit}
                        variant="contained"
                        color="success"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : t('consentsCollection.approve')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for invalidation confirmation */}
            <Dialog open={invalidateDialogOpen} onClose={() => setInvalidateDialogOpen(false)}>
                <DialogTitle>{t('consentsCollection.invalidate')}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {t('consentsCollection.invalidateConfirmation')}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInvalidateDialogOpen(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button 
                        onClick={handleInvalidateSubmit}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : t('consentsCollection.invalidate')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ZudConsent; 