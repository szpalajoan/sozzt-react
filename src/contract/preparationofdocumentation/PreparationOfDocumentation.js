import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import SnackbarAlert from '../../components/SnackbarAlert';
import MapVerificationStep from './components/MapVerificationStep';
import RouteDrawingStep from './components/RouteDrawingStep';
import ConsentsVerificationStep from './components/ConsentsVerificationStep';
import { useDocumentation } from './hooks/useDocumentation';
import { useRouteDrawingPerson } from './hooks/useRouteDrawingPerson';
import { useDocumentationFiles } from './hooks/useDocumentationFiles';
import { useDocumentCompilation } from './hooks/useDocumentCompilation';
import DocumentCompilationStep from './components/DocumentCompilationStep';
import { useTauronCommunication } from './hooks/useTauronCommunication';
import TauronCommunicationStep from './components/TauronCommunicationStep';
import { useTermVerification } from './hooks/useTermVerification';
import TermVerificationStep from './components/TermVerificationStep';

const PreparationOfDocumentation = ({ contractId }) => {
  const {
    documentation,
    setDocumentation,
    loading,
    isPending,
    snackbar,
    setSnackbar,
    approveMap,
    completeConsentsVerification,
    fetchData
  } = useDocumentation(contractId);

  const handleSuccess = (message) => setSnackbar({ open: true, message, severity: 'success' });
  const handleError = (message) => setSnackbar({ open: true, message, severity: 'error' });

  const routeDrawingPerson = useRouteDrawingPerson(
    documentation, 
    setDocumentation,
    contractId, 
    fetchData,
    handleSuccess,
    handleError
  );

  const drawnRouteFiles = useDocumentationFiles(
    contractId,
    'MAP_WITH_ROUTE',
    setDocumentation,
    handleSuccess,
    handleError
  );

  const pdfFiles = useDocumentationFiles(
    contractId,
    'PDF_WITH_ROUTE_AND_DATA',
    setDocumentation,
    handleSuccess,
    handleError
  );

  const documentCompilation = useDocumentCompilation(
    documentation,
    setDocumentation,
    contractId,
    handleSuccess,
    handleError
  );

  const tauronCommunication = useTauronCommunication(
    contractId,
    fetchData,
    setDocumentation,
    handleSuccess,
    handleError
  );

  const termVerification = useTermVerification(
    documentation,
    setDocumentation,
    contractId,
    fetchData,
    handleSuccess,
    handleError
  );

  if (isPending) return <CircularProgress />;
  if (!documentation) return <Typography>Nie znaleziono dokumentacji</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <MapVerificationStep 
        documentation={documentation}
        loading={loading}
        onApprove={approveMap}
      />

      <RouteDrawingStep 
        documentation={documentation}
        personResponsible={routeDrawingPerson.personResponsible}
        isEditingPerson={routeDrawingPerson.isEditingPerson}
        onPersonEdit={() => routeDrawingPerson.setIsEditingPerson(true)}
        setPersonResponsible={routeDrawingPerson.setPersonResponsible}
        handlePersonResponsibleChange={routeDrawingPerson.handlePersonResponsibleChange}
        loading={loading}
        drawnRouteProps={{
          contractId,
          ...drawnRouteFiles,
          loading
        }}
        pdfProps={{
          contractId,
          ...pdfFiles,
          loading
        }}
      />

      <ConsentsVerificationStep 
        documentation={documentation}
        loading={loading}
        onComplete={completeConsentsVerification}
      />

      <DocumentCompilationStep 
        documentation={documentation}
        designer={documentCompilation.designer}
        isEditingDesigner={documentCompilation.isEditingDesigner}
        onDesignerEdit={() => documentCompilation.setIsEditingDesigner(true)}
        setDesigner={documentCompilation.setDesigner}
        handleDesignerChange={documentCompilation.handleDesignerChange}
        loading={loading}
        documentProps={{
          contractId,
          files: documentCompilation.documentFiles,
          newFiles: documentCompilation.newDocumentFiles,
          handleFileDrop: documentCompilation.handleDocumentDrop,
          handleFileDelete: documentCompilation.handleDocumentDelete,
          handleSave: documentCompilation.handleUploadDocument,
          loading,
          titleTranslationKey: "documentation.fileUpload.compiledDocumentTitle"
        }}
      />

      <TauronCommunicationStep 
        documentation={documentation}
        onMarkSent={tauronCommunication.handleMarkSent}
        onMarkApproved={tauronCommunication.handleMarkApproved}
        loading={loading}
      />

      <TermVerificationStep 
        documentation={documentation}
        personResponsible={termVerification.personResponsible}
        isEditingPerson={termVerification.isEditingPerson}
        onPersonEdit={() => termVerification.setIsEditingPerson(true)}
        setPersonResponsible={termVerification.setPersonResponsible}
        handlePersonChange={termVerification.handlePersonChange}
        onApproveTerms={termVerification.handleApproveTerms}
        onComplete={termVerification.handleComplete}
        loading={loading}
      />

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