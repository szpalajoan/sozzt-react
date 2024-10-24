import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useFileHandler = () => {
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  const handleFileDrop = (acceptedFiles) => {
    setNewFiles([...newFiles, ...acceptedFiles]);
  };

  const handleFileDelete = (fileId) => {
    setDeletedFiles([...deletedFiles, fileId]);
    setFiles((prevFiles) => prevFiles.filter(file => file.fileId !== fileId));
  };

  const resetFiles = () => {
    setNewFiles([]);
    setDeletedFiles([]);
  };

  const uploadFiles = async (contractId, fetchData, fileType) => {
    if (newFiles.length > 0) {
      await Promise.all(
        newFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('fileId', uuidv4());
          await fetchData(`contracts/${contractId}/${fileType}`, 'POST', formData);
        })
      );
    }
  };

  const deleteFiles = async (contractId, fetchData) => {
    if (deletedFiles.length > 0) {
      await Promise.all(
        deletedFiles.map(async (fileId) => {
          await fetchData(`contracts/${contractId}/${fileId}`, 'DELETE');
        })
      );
    }
  };

  return {
    files,
    newFiles,
    deletedFiles,
    handleFileDrop,
    handleFileDelete,
    uploadFiles,
    deleteFiles,
    resetFiles,
    setFiles
  };
};

export default useFileHandler;
