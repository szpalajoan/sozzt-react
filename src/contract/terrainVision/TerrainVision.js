import React, { useState, useEffect } from 'react';
import useFetch from "../../useFetch";
import { renderTextFields } from '../renderTextFields';
import { terrainVisionFields } from './TerrainVisionFields';
import useFileHandler from '../useFileHandler';
import { Button, Box, CircularProgress, Snackbar, Alert, Typography, ImageList, ImageListItem, Modal } from '@mui/material';
import FileUploadSection from '../FileUploadSection';
import useDataFetching from '../../useDataFetching';
import { useNavigate } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css'

const TerrainVision = ({ contractId }) => {
  const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

  const { data: terrainVisionData, isPending: isTerrainVisionPending, refetch: refetchTerrainVision } = useFetch(`contracts/terrain-vision/${contractId}`);

  const { data: fetchedTerrainFiles, isPending: isTerrainFilesPending, refetch: refetchTerrainFiles } = useFetch(`contracts/${contractId}/files?fileType=PHOTO_FROM_PLACE_OF_THE_CONTRACT`);
  const { data: fetchedMapFiles, isPending: isMapFilesPending, refetch: refetchMapFiles } = useFetch(`contracts/${contractId}/files?fileType=PRELIMINARY_UPDATED_MAP`);

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

  const [selectedImage, setSelectedImage] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    if (fetchedTerrainFiles) {
      console.log("Pobrano zdjęcia z terenu:", fetchedTerrainFiles);
      setTerrainFiles(fetchedTerrainFiles);
    }
  }, [fetchedTerrainFiles]);

  useEffect(() => {
    console.log("Aktualne terrainFiles:", terrainFiles);
  }, [terrainFiles]);

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

  const isImageFile = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    return allowedImageExtensions.includes(extension);
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
      await uploadMapFiles(contractId, fetchData, 'preliminary-updated-maps');
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

  const handleFinalizeTerrainVision = async () => {
    setLoading(true);
    try {
      await fetchData(`contracts/terrain-vision/${contractId}/complete-terrain-vision`, 'POST');
      setOpenSnackbar(true);
      setErrorMessage('Wizja terenowa została pomyślnie zakończona i przekazana dalej.');
      refetchTerrainVision();
      navigate(0);
    } catch (error) {
      console.error('Błąd podczas finalizacji wizji terenowej:', error);
      setErrorMessage('Wystąpił błąd podczas finalizacji wizji terenowej.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isTerrainVisionPending || isTerrainFilesPending || isMapFilesPending) return <CircularProgress />;
  if (!terrainVisionData) return <div>Nie znaleziono danych wizji terenowej</div>;

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
  };


  const generateFileUrl = (fileId) => {
    return `http://localhost:8080/api/contracts/${contractId}/${fileId}`;
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const galleryImages = terrainFiles
    .filter(file => isImageFile(file.fileName))
    .map(file => ({
      original: generateFileUrl(file.fileId),
      thumbnail: generateFileUrl(file.fileId),
      description: file.fileName
    }));

  return (
    <Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box className="main-content">
        <h2 className="section-title"> Zdjęcia z trasy</h2>
          {terrainFiles.length > 0 ? (
            <ImageList
              sx={{
                width: '100%',
                height: terrainFiles.length <= 4 ? 200 : terrainFiles.length <= 8 ? 350 : 400
              }}
              cols={4}
              rowHeight={164}
            >
              {terrainFiles.filter(file => isImageFile(file.fileName)).map((file, index) => {
                const fileUrl = generateFileUrl(file.fileId);
                return (
                  <ImageListItem key={index} onClick={() => handleImageClick(index)}>
                    <img
                      src={fileUrl}
                      alt={file.fileName || `Zdjęcie ${index + 1}`}
                      loading="lazy"
                      style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        console.error(`Błąd ładowania obrazu ${index}:`, e);
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Brak+obrazu';
                      }}
                    />
                  </ImageListItem>
                );
              })}
            </ImageList>
          ) : (
            <Typography variant="body1">Brak zdjęć do wyświetlenia</Typography>
          )}
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
        <h2 className="section-title">Poprawiona wstępna mapa</h2>
          {terrainVisionData.mapChange === "NOT_NECESSARY" ? (
            <Typography variant="body1">Poprawiona mapa nie jest potrzebna dla tego kontraktu.</Typography>
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
                      Nie trzeba poprawiać mapy
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Box>

        {terrainVisionData.allPhotosUploaded && terrainVisionData.mapChange !== "NONE" &&
         terrainVisionData.terrainVisionStatus == "IN_PROGRESS" && (
          <Box className="finalize-content" >
            <h2 className="section-title"> Finalizacja wizji terenowej</h2>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Wszystkie zdjęcia zostały przesłane i mapa została zatwierdzona. Możesz teraz sfinalizować ten etap.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
              Uwaga: Po zatwierdzeniu, ten etap zostanie przekazany do następnej osoby w procesie.
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={handleFinalizeTerrainVision}
              disabled={loading}
            >
              Zatwierdź i zakończ wizję terenową
            </Button>
          </Box>
        )}
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

      <Modal
        open={isGalleryOpen}
        onClose={handleCloseGallery}
        aria-labelledby="image-gallery-modal"
        aria-describedby="image-gallery-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          {galleryImages.length > 0 ? (
            <ImageGallery
              items={galleryImages}
              startIndex={currentImageIndex}
              showPlayButton={false}
              showFullscreenButton={false}
              onSlide={(currentIndex) => setCurrentImageIndex(currentIndex)}
            />
          ) : (
            <Typography variant="body1">Brak zdjęć do wyświetlenia</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );

};

export default TerrainVision;