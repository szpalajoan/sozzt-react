import React, { useState, useEffect } from 'react';
import useFetch from "../../useFetch";
import { renderTextFields } from '../renderTextFields';
import { terrainVisionFields } from './TerrainVisionFields';
import useFileHandler from '../useFileHandler';
import { Button, Box, CircularProgress, Snackbar, Alert, Paper, Typography, Grid } from '@mui/material';
import FileUploadSection from '../FileUploadSection';
import useDataFetching from '../../useDataFetching';
import { useNavigate } from 'react-router-dom';


const TerrainVision = ({ contractId }) => {
  const { data: terrainVisionData, isPending: isTerrainVisionPending, refetch: refetchTerrainVision } = useFetch(`contracts/terrain-vision/${contractId}`);
  const { data: fetchedTerrainFiles, isPending: isTerrainFilesPending, refetch: refetchTerrainFiles } = useFetch(`contracts/${contractId}/files?fileType=TERRAIN_VISION`);
  const { data: fetchedMapFiles, isPending: isMapFilesPending, refetch: refetchMapFiles } = useFetch(`contracts/${contractId}/files?fileType=TERRAIN_MAP`);

  const { fetchData } = useDataFetching();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    files: terrainFiles,
    newFiles: newTerrainFiles,
    handleFileDrop: handleTerrainFileDrop,
    handleFileDelete: handleTerrainFileDelete,
    uploadFiles: uploadTerrainFiles,
    deleteFiles: deleteTerrainFiles,
    setFiles: setTerrainFiles,
    resetFiles: resetTerrainFiles
  } = useFileHandler();

  const {
    files: mapFiles,
    newFiles: newMapFiles,
    handleFileDrop: handleMapFileDrop,
    handleFileDelete: handleMapFileDelete,
    uploadFiles: uploadMapFiles,
    deleteFiles: deleteMapFiles,
    setFiles: setMapFiles,
    resetFiles: resetMapFiles
  } = useFileHandler();

  useEffect(() => {
    if (fetchedTerrainFiles) {
      console.log("Pobrano zdjęcia z terenu:", fetchedTerrainFiles);
      setTerrainFiles(fetchedTerrainFiles);
    }
  }, [fetchedTerrainFiles]);

  useEffect(() => {
    if (fetchedMapFiles) {
      console.log("Pobrano mapy:", fetchedMapFiles);
      setMapFiles(fetchedMapFiles);
    }
  }, [fetchedMapFiles]);

  const handleSaveTerrainPhotos = async () => {
    setLoading(true);
    try {
      await deleteTerrainFiles(contractId, fetchData);
      await uploadTerrainFiles(contractId, fetchData, 'terrain-vision');
      refetchTerrainFiles();
      resetTerrainFiles();
      setOpenSnackbar(true);
      setErrorMessage('Zdjęcia z terenu zostały zapisane pomyślnie.');
    } catch (error) {
      console.error('Błąd podczas zapisywania zdjęć z terenu:', error);
      setErrorMessage('Wystąpił błąd podczas zapisywania zdjęć z terenu.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMap = async () => {
    setLoading(true);
    try {
      await deleteMapFiles(contractId, fetchData);
      await uploadMapFiles(contractId, fetchData, 'terrain-map');
      refetchMapFiles();
      resetMapFiles();
      setOpenSnackbar(true);
      setErrorMessage('Mapa została zapisana pomyślnie.');
    } catch (error) {
      console.error('Błąd podczas zapisywania mapy:', error);
      setErrorMessage('Wystąpił błąd podczas zapisywania mapy.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await fetchData(`contracts/terrain-vision/${contractId}/complete`, 'POST');
      refetchTerrainVision();
      console.log("Wizja terenowa została skompletowana.");
      navigate(0);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message || 'Wystąpił błąd podczas kompletowania wizji terenowej.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (isTerrainVisionPending || isTerrainFilesPending || isMapFilesPending) return <CircularProgress />;
  if (!terrainVisionData) return <div>Nie znaleziono danych wizji terenowej</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Wizja terenowa</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Zdjęcia z terenu</Typography>
            <FileUploadSection
              contractId={contractId}
              files={terrainFiles}
              newFiles={newTerrainFiles}
              handleFileDrop={handleTerrainFileDrop}
              handleFileDelete={handleTerrainFileDelete}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveTerrainPhotos} 
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Zapisz zdjęcia z terenu'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Mapa</Typography>
            <FileUploadSection
              contractId={contractId}
              files={mapFiles}
              newFiles={newMapFiles}
              handleFileDrop={handleMapFileDrop}
              handleFileDelete={handleMapFileDelete}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveMap} 
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Zapisz mapę'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Button variant="contained" className="finalize-button" onClick={handleComplete} disabled={loading}>
          Kompletuj
        </Button>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TerrainVision;