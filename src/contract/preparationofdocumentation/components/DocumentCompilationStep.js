import React from 'react';
import { Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import OpenFolderButton from '../../../components/OpenFolderButton';
import FileUploadSection from '../../../components/FileUploadSection';
import { useTranslation } from 'react-i18next';

const DocumentCompilationStep = ({
  documentation,
  documentProps,
  loading,
  isDisabled
}) => {
  const { t } = useTranslation();

  return (
    <Box 
      className="main-content"
      sx={{ 
        opacity: isDisabled ? 0.5 : 1,
        pointerEvents: isDisabled ? 'none' : 'auto',
        position: 'relative'
      }}
    >
      {isDisabled && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            position: 'absolute',
            top: 8,
            right: 16
          }}
        >
          Najpierw zweryfikuj zgody
        </Typography>
      )}

      <h2 className="section-title">{t('documentation.documentCompilation.title')}</h2>
      
      {/* Designer info */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon color="action" />
        <Typography>Projektant</Typography>
      </Box>

      {/* Document upload section */}
      {documentation.documentCompilation?.compiledDocumentId ? (
        <>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
            {t('documentation.documentCompilation.documentUploaded')}
          </Typography>
          <OpenFolderButton
            folderPath="Projekty"
            buttonText="Otwórz folder"
          />
        </>
      ) : (
        <FileUploadSection {...documentProps} />
      )}
    </Box>
  );
};

export default DocumentCompilationStep; 