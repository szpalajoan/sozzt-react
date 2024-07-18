import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ContractList = ({ contracts }) => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/add');
  };

  return (
    <div className="contracts-list">
      <h2>Lista kontraktów</h2>
      <button onClick={handleAddClick}>Dodaj nowy kontrakt</button>
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
};

export default ContractList;
