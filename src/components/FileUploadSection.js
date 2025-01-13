import React from 'react';
import { Box, Typography, List, ListItem, IconButton, Button, CircularProgress } from '@mui/material';
import { Delete } from '@mui/icons-material';
import Dropzone from 'react-dropzone';
import FileLink from '../contract/FileLink';
import { useTranslation } from 'react-i18next';

const FileUploadSection = ({ 
  files, 
  newFiles, 
  handleFileDrop, 
  handleFileDelete, 
  contractId, 
  titleTranslationKey,
  handleSave,
  loading,
  showSaveButton = true
}) => {
  const { t } = useTranslation();
  return (
    <Box mb={2}>
      <Typography variant="h6">{t(titleTranslationKey)}</Typography>
      <List>
        {files.map((file) => (
          <ListItem key={file.fileId}>
            <FileLink contractId={contractId} fileId={file.fileId} fileName={file.fileName} />
            <IconButton edge="end" aria-label="delete" onClick={() => handleFileDelete(file.fileId)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
        {newFiles.map((file, index) => (
          <ListItem key={index}>
            <Typography>{file.name}</Typography>
            <IconButton edge="end" aria-label="delete" onClick={() => handleFileDelete(file.name)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
        <Dropzone onDrop={handleFileDrop}>
          {({ getRootProps, getInputProps }) => (
            <Box {...getRootProps()} className="dropzone-container">
              <input {...getInputProps()} />
              <Typography>{t('fileUpload.dragAndDropText')}</Typography>
            </Box>
          )}
        </Dropzone>
      </List>
      {showSaveButton && (
        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : t('common.upload.save')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadSection;

