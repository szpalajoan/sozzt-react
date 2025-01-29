import React from 'react';
import { 
    ListItem, 
    Box, 
    Typography, 
    Chip, 
    Button 
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import FileLink from '../../../contract/FileLink';

const ConsentItem = ({ 
    consent, 
    files, 
    contractId, 
    type = 'private',
    onOpenDialog, 
    onOpenApproveDialog 
}) => {
    const { t } = useTranslation();
    const consentId = type === 'private' 
        ? consent.privatePlotOwnerConsentId 
        : consent.publicPlotOwnerConsentId;

    return (
        <ListItem 
            className="main-content" 
            sx={{ flexDirection: 'column', alignItems: 'flex-start', padding: 2 }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                <h2 className="section-title" style={{ marginRight: '10px', marginBottom: 0 }}>
                    {consent.plotNumber} - {consent.ownerName}
                </h2>
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

            <Typography>
                {t('consentsCollection.createDate')}: {new Date(consent.consentCreateDate).toLocaleDateString()}
            </Typography>

            {consent.comment && (
                <Typography>
                    {t('consentsCollection.comment')}: {consent.comment}
                </Typography>
            )}

            {consent.collectorName && (
                <Typography>
                    {t('consentsCollection.collectorName')}: {consent.collectorName}
                </Typography>
            )}

            {consent.consentStatus === 'CONSENT_GIVEN' && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">
                        {t('consentsCollection.consentScan')}:
                    </Typography>
                    {files && files.find(file => file.additionalObjectId === consentId) ? (
                        <FileLink
                            contractId={contractId}
                            fileId={files.find(file => file.additionalObjectId === consentId).fileId}
                            fileName={files.find(file => file.additionalObjectId === consentId).fileName}
                        />
                    ) : (
                        <Typography variant="body2">
                            {t('consentsCollection.noScanAvailable')}
                        </Typography>
                    )}
                </Box>
            )}

            {consent.consentStatus === 'CONSENT_CREATED' && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        startIcon={<Check />}
                        onClick={() => onOpenApproveDialog()}
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
                        onClick={() => onOpenDialog('INVALIDATED')}
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
                    onClick={() => onOpenDialog('CONSENT_GIVEN')}
                    variant="contained"
                    color="success"
                >
                    {t('consentsCollection.markAsGiven')}
                </Button>
            )}

            {consent.statusComment && (
                <Typography>
                    {t('consentsCollection.statusComment')}: {consent.statusComment}
                </Typography>
            )}
        </ListItem>
    );
};

export default ConsentItem; 