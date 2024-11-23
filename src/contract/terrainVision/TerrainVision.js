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

  const { data: fetchedTerrainFiles, isPending: isTerrainFilesPending, refetch: refetchTerrainFiles } = useFetch(`contracts/${contractId}/files?fileType=PHOTO_FROM_PLACE_OF_THE_CONTRACT`);
  const { data: fetchedMapFiles, isPending: isMapFilesPending, refetch: refetchMapFiles } = useFetch(`contracts/${contractId}/files?fileType=PRELIMINARY_MAP_UPDATED`);

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
      await uploadTerrainFiles(contractId, fetchData, 'photos-from-place-of-the-contract');
      refetchTerrainVision();
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

  const handleConfirmAllPhotosUploaded = async () => {
    try {
      await handleSaveTerrainPhotos(contractId, fetchData);
      await fetchData(`contracts/terrain-vision/${contractId}/confirm-all-photos-are-uploaded`, 'POST');
      setOpenSnackbar(true);
      setErrorMessage('Potwierdzono załadowanie wszystkich zdjęć.');
      refetchTerrainVision();
    } catch (error) {
      console.error('Błąd podczas potwierdzania załadowania zdjęć:', error);
      setErrorMessage('Wystąpił błąd podczas potwierdzania załadowania zdjęć.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMap = async () => {
    setLoading(true);
    try {
      await deleteMapFiles(contractId, fetchData);
      await uploadMapFiles(contractId, fetchData, 'preliminary-maps-updated');
      refetchTerrainVision();
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

  const handleConfirmMapChanges = async (mapChange) => {
    try {
      await handleSaveMap();
      await fetchData(`contracts/terrain-vision/${contractId}/confirm-changes-on-map`, 'POST', { mapChange });
      setOpenSnackbar(true);
      setErrorMessage(`Potwierdzono zmiany na mapie: ${mapChange}`);
      refetchTerrainVision();
    } catch (error) {
      console.error('Błąd podczas potwierdzania zmian na mapie:', error);
      setErrorMessage('Wystąpił błąd podczas potwierdzania zmian na mapie.');
      setOpenSnackbar(true);
    }
  };


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isTerrainVisionPending || isTerrainFilesPending || isMapFilesPending) return <CircularProgress />;
  if (!terrainVisionData) return <div>Nie znaleziono danych wizji terenowej</div>;

  return (
    <Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        <Box className="main-content">
          <h2>Zdjęcia z trasy</h2>
          <FileUploadSection
            contractId={contractId}
            files={terrainFiles}
            newFiles={newTerrainFiles}
            handleFileDrop={handleTerrainFileDrop}
            handleFileDelete={handleTerrainFileDelete}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveTerrainPhotos}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Zapisz zdjęcia z terenu'}
            </Button>

            {!terrainVisionData.allPhotosUploaded && (
              <Button
                variant="contained"
                color="success"
                onClick={handleConfirmAllPhotosUploaded}
                disabled={loading}
              >
                Potwierdź załadowanie wszystkich zdjęć
              </Button>
            )}
          </Box>
        </Box>

        <Box className="main-content">
          <h2>Poprawiona wstępna mapa</h2>
          {terrainVisionData.mapChange === "NOT_NECESSARY" ? (
            <Typography variant="body1">Mapa nie jest potrzebna dla tego kontraktu.</Typography>
          ) : (
            <>
              <FileUploadSection
                contractId={contractId}
                files={mapFiles}
                newFiles={newMapFiles}
                handleFileDrop={handleMapFileDrop}
                handleFileDelete={handleMapFileDelete}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveMap}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Zapisz mapę'}
                </Button>
                {terrainVisionData.mapChange === "NONE" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleConfirmMapChanges("MODIFIED")}
                      disabled={loading}
                    >
                      Zatwierdź zmodyfikowaną mapę
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleConfirmMapChanges("NOT_NECESSARY")}
                      disabled={loading}
                      sx={{ backgroundColor: 'grey.500', color: 'white', '&:hover': { backgroundColor: 'grey.600' } }}
                    >
                      Mapa nie jest potrzebna
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Box>


      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={errorMessage.includes('błąd') ? 'error' : 'success'} sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TerrainVision;