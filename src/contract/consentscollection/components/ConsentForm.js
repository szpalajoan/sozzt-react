import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ConsentForm = ({ onSubmit, type }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        ownerName: '',
        plotNumber: '',
        comment: '',
        collectorName: '',
        mailingDate: ''
    });

    const collectors = ['Ania', 'Kasia', 'Basia'];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.ownerName || !formData.plotNumber) return;

        try {
            await onSubmit(formData);
            setFormData(prev => ({
                ...prev,
                ownerName: '',
                plotNumber: '',
                comment: '',
                mailingDate: ''
            }));
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

            {type === 'private' && (
                <FormControl sx={{ mr: 2, minWidth: 120 }}>
                    <InputLabel id="collector-select-label">
                        {t('consentsCollection.collectorName')}
                    </InputLabel>
                    <Select
                        labelId="collector-select-label"
                        value={formData.collectorName}
                        onChange={(e) => handleInputChange('collectorName', e.target.value)}
                        label={t('consentsCollection.collectorName')}
                    >
                        {collectors.map((collector) => (
                            <MenuItem key={collector} value={collector}>{collector}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {type === 'public' && (
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
            )}

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

export default ConsentForm; 