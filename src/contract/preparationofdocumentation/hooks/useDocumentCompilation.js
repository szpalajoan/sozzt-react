import { useState, useEffect } from 'react';
import useFileHandler from '../../useFileHandler';
import useDataFetching from '../../../useDataFetching';
import documentationApi from '../api/documentationApi';

export const useDocumentCompilation = (documentation, setDocumentation, contractId, onSuccess, onError) => {
  const [designer, setDesigner] = useState('');
  const [isEditingDesigner, setIsEditingDesigner] = useState(false);
  const { fetchData } = useDataFetching();

  const {
    files: documentFiles,
    newFiles: newDocumentFiles,
    handleFileDrop: handleDocumentDrop,
    handleFileDelete: handleDocumentDelete,
    uploadDocumentationFiles: uploadDocument,
    setFiles: setDocumentFiles,
    resetFiles: resetDocumentFiles
  } = useFileHandler();

  useEffect(() => {
    if (documentation?.documentCompilation?.designer) {
      setDesigner(documentation.documentCompilation.designer);
    }
  }, [documentation]);

  const handleDesignerChange = async () => {
    try {
      await documentationApi.chooseDesigner(contractId, fetchData, designer);
      setIsEditingDesigner(false);
      setDocumentation(prev => ({
        ...prev,
        documentCompilation: {
          ...prev.documentCompilation,
          designer: designer
        }
      }));
      onSuccess('Projektant został wybrany pomyślnie');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas wybierania projektanta');
    }
  };

  const handleUploadDocument = async () => {
    try {
      const formData = new FormData();
      formData.append('file', newDocumentFiles[0]);
      const response = await documentationApi.uploadCompiledDocument(contractId, fetchData, formData);
      
      setDocumentation(prev => ({
        ...prev,
        documentCompilation: {
          ...prev.documentCompilation,
          compiledDocumentId: response.fileId
        }
      }));
      
      resetDocumentFiles();
      onSuccess('Dokument został wgrany pomyślnie');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas wgrywania dokumentu');
    }
  };

  return {
    designer,
    setDesigner,
    isEditingDesigner,
    setIsEditingDesigner,
    handleDesignerChange,
    documentFiles,
    newDocumentFiles,
    handleDocumentDrop,
    handleDocumentDelete,
    handleUploadDocument
  };
}; 