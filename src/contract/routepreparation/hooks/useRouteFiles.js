import { useState } from 'react';
import useFileHandler from '../../useFileHandler';
import routePreparationApi from '../api/routePreparationApi';

export const useRouteFiles = (routePreparation, setRoutePreparation, contractId, fetchData, onSuccess, onError, fileType, refetch) => {
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

      if (fileType === 'drawnRoute') {
        await routePreparationApi.uploadDrawnRoute(contractId, fetchData, formData);
      } else if (fileType === 'pdfWithRoute') {
        await routePreparationApi.uploadPdfWithRoute(contractId, fetchData, formData);
      }

      resetFiles();
      if (fileType === 'drawnRoute') {
        onSuccess('Rysowana mapa została wgrana pomyślnie');
      } else if (fileType === 'pdfWithRoute') {
        onSuccess('Plik PDF został wgrany pomyślnie');
      }
      await refetch();
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