import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const PublicConsentForm = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        ownerName: '',
        plotNumber: '',
        comment: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.ownerName || !formData.plotNumber) return;

        try {
            await onSubmit(formData);
            setFormData({
                ownerName: '',
                plotNumber: '',
                comment: ''
            });
        } catch (error) {
            console.error('Error adding consent:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
                label={t('consentsCollection.publicOwnerName')}
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