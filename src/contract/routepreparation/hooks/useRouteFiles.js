import { useState } from 'react';
import useFileHandler from '../../useFileHandler';
import routePreparationApi from '../api/routePreparationApi';

export const useRouteFiles = (routePreparation, setRoutePreparation, contractId, fetchData, onSuccess, onError, fileType) => {
  const [loading, setLoading] = useState(false);

  const {
    files,
    newFiles,
    handleFileDrop,
    handleFileDelete,
    resetFiles,
    setFiles
  } = useFileHandler();

  const uploadFile = async () => {
    if (newFiles.length === 0) {
      onError('Proszę wybrać plik do wgrania');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', newFiles[0]);

      let response;
      if (fileType === 'drawnRoute') {
        response = await routePreparationApi.uploadDrawnRoute(contractId, fetchData, formData);
        setRoutePreparation(prev => ({
          ...prev,
          routeDrawing: {
            ...prev.routeDrawing,
            mapWithRouteFileId: response?.fileId
          }
        }));
      } else if (fileType === 'pdfWithRoute') {
        response = await routePreparationApi.uploadPdfWithRoute(contractId, fetchData, formData);
        setRoutePreparation(prev => ({
          ...prev,
          routeDrawing: {
            ...prev.routeDrawing,
            routeWithDataFileId: response?.fileId
          }
        }));
      }

      resetFiles();
      onSuccess('Plik został wgrany pomyślnie');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas wgrywania pliku');
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    newFiles,
    handleFileDrop,
    handleFileDelete,
    uploadFile,
    setFiles,
    loading
  };
}; 