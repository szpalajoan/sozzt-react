import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import { styles } from './styles';

const ContractRow = ({ contract, onRowClick }) => (
  <TableRow 
    onClick={onRowClick}
    hover
    sx={styles.tableRow}
  >
    <TableCell>{contract.contractDetails.contractNumber}</TableCell>
    <TableCell>{contract.contractDetails.workNumber}</TableCell>
    <TableCell>{contract.contractDetails.customerContractNumber}</TableCell>
    <TableCell>{new Date(contract.contractDetails.orderDate).toLocaleDateString()}</TableCell>
    <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
  </TableRow>
);

ContractRow.propTypes = {
  contract: PropTypes.shape({
    contractId: PropTypes.string.isRequired,
    contractDetails: PropTypes.shape({
      contractNumber: PropTypes.string.isRequired,
      workNumber: PropTypes.string.isRequired,
      customerContractNumber: PropTypes.string.isRequired,
      orderDate: PropTypes.string.isRequired,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default ContractRow;