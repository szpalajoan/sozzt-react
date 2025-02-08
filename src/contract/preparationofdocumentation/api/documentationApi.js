const documentationApi = {
  approveMap: (contractId, fetchData) => 
    fetchData(`contracts/documentation/${contractId}/approve-correctness-of-the-map`, 'POST'),

  chooseRouteDrawingPerson: (contractId, fetchData, user) => 
    fetchData(
      `contracts/documentation/${contractId}/choose-person-responsible-for-route-drawing`,
      'POST',
      { user }
    ),

  uploadDrawnRoute: (contractId, fetchData, formData) =>
    fetchData(`contracts/documentation/${contractId}/drawn-route`, 'POST', formData),

  uploadPdfWithRoute: (contractId, fetchData, formData) =>
    fetchData(`contracts/documentation/${contractId}/pdf-with-route-and-data`, 'POST', formData),

  completeConsentsVerification: (contractId, fetchData) =>
    fetchData(`contracts/documentation/${contractId}/complete-consents-verification`, 'PUT')
};

export default documentationApi; 