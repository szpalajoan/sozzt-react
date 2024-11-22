import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box, Typography } from '@mui/material';
import ContractRow from './ContractRow';
import { styles } from './styles';
import { sortAndFilterContracts } from './utils';
import { useTranslation } from 'react-i18next';

const ContractList = ({ contracts }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const handleAddClick = () => navigate('/add');

  const sortedAndFilteredContracts = useMemo(() => 
    sortAndFilterContracts(contracts, searchTerm), 
    [contracts, searchTerm]
  );

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista kontraktów
      </Typography>
      <Box sx={styles.toolbar}>
        <Button 
          variant="contained" 
          onClick={handleAddClick}
          sx={styles.addButton}
        >
          Dodaj nowy kontrakt
        </Button>
        <TextField 
          label="Wyszukaj" 
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={styles.searchField}
        />
      </Box>
      <TableContainer component={Paper} elevation={3} sx={styles.tableContainer}>
        <Table sx={styles.table} aria-label="contract table">
          <TableHead>
          <TableRow>
              <TableCell sx={styles.tableHeader}>{t('contract.details.contractNumber')}</TableCell>
              <TableCell sx={styles.tableHeader}>{t('contract.details.workingNumber')}</TableCell>
              <TableCell sx={styles.tableHeader}>{t('contract.details.customerContractNumber')}</TableCell>
              <TableCell sx={styles.tableHeader}>{t('contract.details.orderDate')}</TableCell>
              <TableCell sx={styles.tableHeader}>{t('contract.details.creationDate')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredContracts.map((contract) => (
              <ContractRow
                key={contract.contractId}
                contract={contract}
                onRowClick={() => navigate(`/contract/${contract.contractId}`)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

ContractList.propTypes = {
  contracts: PropTypes.array.isRequired,
};
export default ContractList;

