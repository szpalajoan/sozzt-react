import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, TextField, MenuItem, IconButton } from '@mui/material';
import useFetch from "../../useFetch";
import useDataFetching from '../../useDataFetching';
import { useNavigate } from 'react-router-dom';
import FileUploadSection from '../../components/FileUploadSection';
import useFileHandler from '../useFileHandler';
import SnackbarAlert from '../../components/SnackbarAlert';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import OpenFolderButton from '../../components/OpenFolderButton';

const PreparationOfDocumentation = ({ contractId }) => {
  const { data, isPending, refetch: refetchDocumentation } = 
    useFetch(`contracts/documentation/${contractId}`);
  const { data: drawnRouteFiles, refetch: refetchDrawnRouteFiles } = 
    useFetch(`contracts/${contractId}/files?fileType=MAP_WITH_ROUTE`);
  const { data: pdfFiles, refetch: refetchPdfFiles } = 
    useFetch(`contracts/${contractId}/files?fileType=PDF_WITH_ROUTE_AND_DATA`);

  const { fetchData } = useDataFetching();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [personResponsible, setPersonResponsible] = useState('');
  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [consentsVerifier, setConsentsVerifier] = useState('Kasia');
  const [isEditingConsentsVerifier, setIsEditingConsentsVerifier] = useState(false);

  const {
    files: drawnRouteFile,
    newFiles: newDrawnRouteFile,
    handleFileDrop: handleDrawnRouteDrop,
    handleFileDelete: handleDrawnRouteDelete,
    uploadDocumentationFiles: uploadDrawnRoute,
    setFiles: setDrawnRouteFiles,
    resetFiles: resetDrawnRouteFiles
  } = useFileHandler();

  const {
    files: pdfFile,
    newFiles: newPdfFile,
    handleFileDrop: handlePdfDrop,
    handleFileDelete: handlePdfDelete,
    uploadDocumentationFiles: uploadPdf,
    setFiles: setPdfFiles,
    resetFiles: resetPdfFiles
  } = useFileHandler();

  const [documentation, setDocumentation] = useState(null);

  useEffect(() => {
    if (data) {
      setDocumentation(data);
    }
  }, [data]);

  useEffect(() => {
    if (drawnRouteFiles) {
      setDrawnRouteFiles(drawnRouteFiles);
    }
  }, [drawnRouteFiles]);

  useEffect(() => {
    if (pdfFiles) {
      setPdfFiles(pdfFiles);
    }
  }, [pdfFiles]);

  useEffect(() => {
    if (documentation?.routeDrawing?.drawingBy) {
      setPersonResponsible(documentation.routeDrawing.drawingBy);
    }
  }, [documentation]);

  useEffect(() => {
    if (documentation?.consentsVerification?.verifiedBy) {
      setConsentsVerifier(documentation.consentsVerification.verifiedBy);
    }
  }, [documentation]);

  const handleApproveMap = async () => {
    setLoading(true);
    try {
      await fetchData(`contracts/documentation/${contractId}/approve-correctness-of-the-map`, 'POST');
      refetchDocumentation();
      setSnackbar({
        open: true,
        message: 'Mapa została zatwierdzona pomyślnie',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Wystąpił błąd podczas zatwierdzania mapy',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePersonResponsibleChange = async () => {
    setLoading(true);
    try {
      await fetchData(
        `contracts/documentation/${contractId}/choose-person-responsible-for-route-drawing`, 
        'POST', 
        { user: personResponsible }
      );
      refetchDocumentation();
      setSnackbar({
        open: true,
        message: 'Osoba odpowiedzialna została wybrana pomyślnie',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Wystąpił błąd podczas wybierania osoby odpowiedzialnej',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDrawnRoute = async () => {
    setLoading(true);
    try {
      await uploadDrawnRoute(contractId, fetchData, `contracts/documentation/${contractId}/drawn-route`);
      setDocumentation(prev => ({
        ...prev,
        routeDrawing: {
          ...prev.routeDrawing,
          mapWithRouteFileId: true
        }
      }));
      refetchDrawnRouteFiles();
      resetDrawnRouteFiles();
      setSnackbar({
        open: true,
        message: 'Trasa została wgrana pomyślnie',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Wystąpił błąd podczas wgrywania trasy',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPdf = async () => {
    setLoading(true);
    try {
      await uploadPdf(contractId, fetchData, `contracts/documentation/${contractId}/pdf-with-route-and-data`);
      setDocumentation(prev => ({
        ...prev,
        routeDrawing: {
          ...prev.routeDrawing,
          routeWithDataFileId: true
        }
      }));
      refetchPdfFiles();
      resetPdfFiles();
      setSnackbar({
        open: true,
        message: 'PDF został wgrany pomyślnie',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Wystąpił błąd podczas wgrywania PDF',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePersonEdit = () => {
    setIsEditingPerson(true);
  };

  const handleConsentsVerifierChange = async () => {
    setLoading(true);
    try {
      await fetchData(
        `contracts/documentation/${contractId}/choose-person-responsible-for-consents-verification`, 
        'POST', 
        { user: consentsVerifier }
      );
      refetchDocumentation();
      setSnackbar({
        open: true,
        message: 'Osoba weryfikująca została wybrana pomyślnie',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Wystąpił błąd podczas wybierania osoby weryfikującej',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteConsentsVerification = async () => {
    setLoading(true);
    try {
      await fetchData(`contracts/documentation/${contractId}/complete-consents-verification`, 'PUT');
      refetchDocumentation();
      setSnackbar({
        open: true,
        message: 'Zgody zostały zweryfikowane pomyślnie',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Wystąpił błąd podczas weryfikacji zgód',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPending) return <CircularProgress />;
  if (!documentation) return <Typography>Nie znaleziono dokumentacji</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Map Verification Section */}
      <Box className="main-content">
        <h2 className="section-title">Weryfikacja mapy</h2>
        {documentation.correctnessOfTheMap ? (
          <Typography 
            variant="body1" 
            color="success.main"
            sx={{ mt: 1 }}
          >
            Mapa została zatwierdzona
          </Typography>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleApproveMap}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Zatwierdź mapę'}
          </Button>
        )}
      </Box>

      {/* Route Drawing Section */}
      <Box className="main-content">
        <h2 className="section-title">Rysowanie trasy</h2>
        <Box sx={{ mb: 2 }}>
          {!isEditingPerson && documentation.routeDrawing?.drawingBy ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="action" />
              <Typography>{documentation.routeDrawing.drawingBy}</Typography>
              <IconButton 
                size="small" 
                onClick={handlePersonEdit}
                sx={{ ml: 1 }}
              >
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
                onClick={() => {
                  handlePersonResponsibleChange();
                  setIsEditingPerson(false);
                }}
                disabled={!personResponsible || loading}
              >
                Przypisz osobę
              </Button>
            </>
          )}
        </Box>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
          Mapa z trasą
        </Typography>
        {documentation.routeDrawing?.mapWithRouteFileId ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
              Mapa z trasą została już wgrana. Jeśli chcesz wprowadzić zmiany, zrób to bezpośrednio w folderze.
            </Typography>
            <OpenFolderButton
              folderPath="Projekty"
              buttonText="Otwórz folder"
            />
          </>
        ) : (
          <FileUploadSection
            contractId={contractId}
            files={drawnRouteFile}
            newFiles={newDrawnRouteFile}
            handleFileDrop={handleDrawnRouteDrop}
            handleFileDelete={handleDrawnRouteDelete}
            titleTranslationKey="documentation.fileUpload.drawnRouteTitle"
            handleSave={handleUploadDrawnRoute}
            loading={loading}
          />
        )}

        <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 'bold', color: '#333' }}>
          PDF z trasą i danymi
        </Typography>
        {documentation.routeDrawing?.routeWithDataFileId ? (
          <>
            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
              PDF został już wgrany. Jeśli chcesz wprowadzić zmiany, zrób to bezpośrednio w folderze.
            </Typography>
            <OpenFolderButton
              folderPath="Projekty"
              buttonText="Otwórz folder"
            />
          </>
        ) : (
          <FileUploadSection
            contractId={contractId}
            files={pdfFile}
            newFiles={newPdfFile}
            handleFileDrop={handlePdfDrop}
            handleFileDelete={handlePdfDelete}
            titleTranslationKey="documentation.fileUpload.pdfTitle"
            handleSave={handleUploadPdf}
            loading={loading}
          />
        )}
      </Box>

      {/* Consents Verification Section */}
      <Box className="main-content">
        <h2 className="section-title">Weryfikacja zgód</h2>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="action" />
            <Typography>Kasia</Typography>
          </Box>
        </Box>

        {documentation.consentsVerification?.consentsVerified ? (
          <Typography 
            variant="body1" 
            color="success.main"
            sx={{ mt: 1 }}
          >
            Zgody zostały zweryfikowane
          </Typography>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCompleteConsentsVerification}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Zatwierdź weryfikację zgód'}
          </Button>
        )}
      </Box>

      <SnackbarAlert
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default PreparationOfDocumentation; 