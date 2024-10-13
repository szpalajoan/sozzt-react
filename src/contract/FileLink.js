import React from 'react';

const FileLink = ({ contractId, fileId, fileName }) => {
  const fileUrl = `http://localhost:8080/api/contracts/${contractId}/${fileId}`;

  return (
    <div className="form-group">
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        {fileName}
      </a>
    </div>
  );
};

export default FileLink;