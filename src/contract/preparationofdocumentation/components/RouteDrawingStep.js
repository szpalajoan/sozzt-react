import React from 'react';
import { Box, Typography, Button, TextField, MenuItem, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import OpenFolderButton from '../../../components/OpenFolderButton';
import FileUploadSection from '../../../components/FileUploadSection';

const RouteDrawingStep = ({
  documentation,
  personResponsible,
  isEditingPerson,
  onPersonEdit,
  setPersonResponsible,
  handlePersonResponsibleChange,
  loading,
  drawnRouteProps,
  pdfProps
}) => {
  return (
    <Box className="main-content">
      <h2 className="section-title">Rysowanie trasy</h2>
      
      {/* Person selection */}
      <Box sx={{ mb: 1.5 }}>
        {!isEditingPerson && documentation.routeDrawing?.drawingBy ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="action" />
            <Typography>{documentation.routeDrawing.drawingBy}</Typography>
            <IconButton size="small" onClick={onPersonEdit} sx={{ ml: 1 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <>
            <TextField
              select
              label="Osoba odpowiedzialna"
              value={personResponsible}
              onChange={(e) => setPersonResponsible(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            >
              <MenuItem value="user1">User 1</MenuItem>
              <MenuItem value="user2">User 2</MenuItem>
              <MenuItem value="user3">User 3</MenuItem>
            </TextField>
            <Button
              variant="contained"
              onClick={handlePersonResponsibleChange}
              disabled={!personResponsible || loading}
            >
              Przypisz osobę
            </Button>
          </>
        )}
      </Box>

      {/* Show file sections only when person is selected */}
      {documentation.routeDrawing?.drawingBy && (
        <>
          {/* Map upload section */}
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
            Mapa z trasą
          </Typography>
          {documentation.routeDrawing?.mapWithRouteFileId ? (
            <>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                Mapa z trasą została już wgrana. Jeśli chcesz wprowadzić zmiany, zrób to bezpośrednio w folderze.
              </Typography>
              <OpenFolderButton
                folderPath="Projekty"
                buttonText="Otwórz folder"
              />
            </>
          ) : (
            <FileUploadSection {...drawnRouteProps} />
          )}

          {/* PDF upload section */}
          <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: 'bold', color: '#333' }}>
            PDF z trasą i danymi
          </Typography>
          {documentation.routeDrawing?.routeWithDataFileId ? (
            <>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                PDF został już wgrany. Jeśli chcesz wprowadzić zmiany, zrób to bezpośrednio w folderze.
              </Typography>
              <OpenFolderButton
                folderPath="Projekty"
                buttonText="Otwórz folder"
              />
            </>
          ) : (
            <FileUploadSection {...pdfProps} />
          )}
        </>
      )}
    </Box>
  );
};

export default RouteDrawingStep; 