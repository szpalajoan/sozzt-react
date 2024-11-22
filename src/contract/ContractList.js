import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box, Typography } from '@mui/material';

const ContractList = ({ contracts }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClick = () => {
    navigate('/add');
  };

  const handleRowClick = (contractId) => {
    navigate(`/contract/${contractId}`);
  };

  const sortedAndFilteredContracts = useMemo(() => {
    return contracts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter(contract => 
        contract.contractDetails.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractDetails.workNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractDetails.customerContractNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [contracts, searchTerm]);

  return (
    <Box sx={{ width: '100%', mb: 4, p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista kontraktów
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleAddClick}
          sx={{ minWidth: 200 }}
        >
          Dodaj nowy kontrakt
        </Button>
        <TextField 
          label="Wyszukaj" 
          variant="outlined" 
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
        />
      </Box>
      <TableContainer component={Paper} elevation={3} sx={{ marginRight: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="contract table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Numer umowy</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nr roboczy</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nr kontraktu klienta</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data zamówienia</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data utworzenia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredContracts.map((contract) => (
              <TableRow 
                key={contract.contractId}
                onClick={() => handleRowClick(contract.contractId)}
                hover
                sx={{ 
                  cursor: 'pointer',
                  '&:nth-of-type(odd)': {
                    backgroundColor: theme => theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>{contract.contractDetails.contractNumber}</TableCell>
                <TableCell>{contract.contractDetails.workNumber}</TableCell>
                <TableCell>{contract.contractDetails.customerContractNumber}</TableCell>
                <TableCell>{new Date(contract.contractDetails.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContractList;

