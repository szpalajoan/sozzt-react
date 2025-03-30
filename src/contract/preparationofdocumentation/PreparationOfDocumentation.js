import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import SnackbarAlert from '../../components/SnackbarAlert';
import ConsentsVerificationStep from './components/ConsentsVerificationStep';
import { useDocumentation } from './hooks/useDocumentation';
import { useDocumentationFiles } from './hooks/useDocumentationFiles';
import { useDocumentCompilation } from './hooks/useDocumentCompilation';
import DocumentCompilationStep from './components/DocumentCompilationStep';
import { useTauronCommunication } from './hooks/useTauronCommunication';
import TauronCommunicationStep from './components/TauronCommunicationStep';
import { useTermVerification } from './hooks/useTermVerification';
import TermVerificationStep from './components/TermVerificationStep';
import Remarks from '../../components/remarks/Remarks';

const PreparationOfDocumentation = ({ contractId, onRemarkChange }) => {
  const {
    documentation,
    setDocumentation,
    loading,
    isPending,
    snackbar,
    setSnackbar,
    completeConsentsVerification,
    fetchData
  } = useDocumentation(contractId);

  const handleSuccess = (message) => setSnackbar({ open: true, message, severity: 'success' });
  const handleError = (message) => setSnackbar({ open: true, message, severity: 'error' });

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

  const renderStepDetails = () => {
    const commonProps = {
      documentation,
      loading
    };

    return (
      <>
        <ConsentsVerificationStep 
          {...commonProps}
          onComplete={completeConsentsVerification}
        />

        <DocumentCompilationStep 
          {...commonProps}
          designer={documentCompilation.designer}
          isEditingDesigner={documentCompilation.isEditingDesigner}
          onDesignerEdit={() => documentCompilation.setIsEditingDesigner(true)}
          setDesigner={documentCompilation.setDesigner}
          handleDesignerChange={documentCompilation.handleDesignerChange}
          isDisabled={!documentation.consentsVerification?.consentsVerified}
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
          {...commonProps}
          onMarkSent={tauronCommunication.handleMarkSent}
          onMarkApproved={tauronCommunication.handleMarkApproved}
          isDisabled={!documentation.documentCompilation?.compiledDocumentId}
        />

        <TermVerificationStep 
          {...commonProps}
          personResponsible={termVerification.personResponsible}
          isEditingPerson={termVerification.isEditingPerson}
          onPersonEdit={() => termVerification.setIsEditingPerson(true)}
          setPersonResponsible={termVerification.setPersonResponsible}
          handlePersonChange={termVerification.handlePersonChange}
          onApproveTerms={termVerification.handleApproveTerms}
          onComplete={termVerification.handleComplete}
          isDisabled={!documentation.tauronCommunication?.approvedByTauron}
        />

        <Remarks 
          stepId="PREPARATION_OF_DOCUMENTATION" 
          contractId={contractId} 
          onRemarkChange={onRemarkChange}
        />

        <SnackbarAlert
          open={snackbar.open}
          handleClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </>
    );
  };

  if (isPending) return <CircularProgress />;
  if (!documentation) return <Typography>Nie znaleziono dokumentacji</Typography>;

  return (
    <Box className="step-container">
      {renderStepDetails()}
    </Box>
  );
};

export default PreparationOfDocumentation; 