const landExtractsApi = {
  // Pobranie informacji o wypisach
  getLandExtracts: (contractId, fetchData) => 
    fetchData(`contracts/land-extracts/${contractId}`, 'GET'),

  // Wysłanie prośby o wypisy
  requestForLandExtractsSent: (contractId, fetchData) => 
    fetchData(`contracts/land-extracts/${contractId}/request-for-land-extracts-sent`, 'POST'),

  // Zakończenie etapu wypisów
  completeLandExtracts: (contractId, fetchData) =>
    fetchData(`contracts/land-extracts/${contractId}/complete`, 'POST')
};

export default landExtractsApi; 