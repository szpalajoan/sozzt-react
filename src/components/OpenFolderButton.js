import React from 'react';
import { Button } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const OpenFolderButton = ({ folderPath, buttonText, sx = {} }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<FolderOpenIcon />}
      onClick={() => window.open("so3://" + folderPath, '_blank')}
      sx={{ mt: 2, mb: 2, ...sx }}
    >
      {buttonText}
    </Button>
  );
};

export default OpenFolderButton;