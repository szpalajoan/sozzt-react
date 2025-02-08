import { useEffect } from 'react';
import useFetch from "../../../useFetch";
import useFileHandler from '../../useFileHandler';
import useDataFetching from '../../../useDataFetching';

export const useDocumentationFiles = (contractId, fileType, setDocumentation, onSuccess, onError) => {
  const { data: files, refetch: refetchFiles } = 
    useFetch(`contracts/${contractId}/files?fileType=${fileType}`);
  const { fetchData } = useDataFetching();

  const {
    files: fileList,
    newFiles,
    handleFileDrop,
    handleFileDelete,
    uploadDocumentationFiles: uploadFile,
    setFiles,
    resetFiles
  } = useFileHandler();

  useEffect(() => {
    if (files) {
      setFiles(files);
    }
  }, [files, setFiles]);

  const handleUpload = async () => {
    try {
      const uploadPath = fileType === 'MAP_WITH_ROUTE' 
        ? `contracts/documentation/${contractId}/drawn-route`
        : `contracts/documentation/${contractId}/pdf-with-route-and-data`;

      await uploadFile(contractId, fetchData, uploadPath);
      setDocumentation(prev => ({
        ...prev,
        routeDrawing: {
          ...prev.routeDrawing,
          [fileType === 'MAP_WITH_ROUTE' ? 'mapWithRouteFileId' : 'routeWithDataFileId']: true
        }
      }));
      refetchFiles();
      resetFiles();
      onSuccess('Plik został wgrany pomyślnie');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas wgrywania pliku');
    }
  };

  return {
    files: fileList,
    newFiles,
    handleFileDrop,
    handleFileDelete,
    handleSave: handleUpload
  };
}; 