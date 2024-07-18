import React from 'react';
import { Link } from 'react-router-dom';


const ContractList = ({ contracts }) => {
  return (
    <div className="contracts-list">
      <h2>Lista kontraktów</h2>
      {contracts.map(contract => (
        <div className="blog-preview" key={contract.contractId} >
          <h2>{contract.createdBy}</h2>
          <Link to={`/contract/${contract.contractId}`}>
            <p>{contract.contractId}</p>
          </Link>
      </div>
      ))}
    </div>
  );
}

export default ContractList;

