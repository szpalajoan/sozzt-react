export const sortAndFilterContracts = (contracts, searchTerm) => {
    return contracts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter(contract => 
        contract.contractDetails.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractDetails.workNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractDetails.customerContractNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };