import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const PublicConsentForm = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        ownerName: '',
        plotNumber: '',
        comment: '',
        mailingDate: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.ownerName || !formData.plotNumber) return;

        try {
            const submitData = {
                ...formData,
                mailingDate: formData.mailingDate 
                    ? new Date(formData.mailingDate + 'T00:00:00.000Z').toISOString()
                    : null
            };

            await onSubmit(submitData);
            setFormData({
                ownerName: '',
                plotNumber: '',
                comment: '',
                mailingDate: ''
            });
        } catch (error) {
            console.error('Error adding consent:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
                label={t('consentsCollection.ownerName')}
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                sx={{ mr: 2 }}
            />
            <TextField
                label={t('consentsCollection.plotNumber')}
                value={formData.plotNumber}
                onChange={(e) => handleInputChange('plotNumber', e.target.value)}
                sx={{ mr: 2 }}
            />
            <TextField
                label={t('consentsCollection.mailingDate')}
                type="date"
                value={formData.mailingDate}
                onChange={(e) => handleInputChange('mailingDate', e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{ mr: 2 }}
            />
            <Button
                startIcon={<Add />}
                onClick={handleSubmit}
                variant="contained"
            >
                {t('consentsCollection.add')}
            </Button>
        </Box>
    );
};

export default PublicConsentForm; 