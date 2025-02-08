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
    fetchData(`contracts/documentation/${contractId}/complete-consents-verification`, 'PUT'),

  uploadCompiledDocument: (contractId, fetchData, formData) =>
    fetchData(`contracts/documentation/${contractId}/complete-document-compilation`, 'PUT', formData),

  chooseDesigner: (contractId, fetchData, user) => 
    fetchData(
      `contracts/documentation/${contractId}/choose-designer`,
      'POST',
      { user }
    ),

  markDocumentationSentToTauron: (contractId, fetchData) =>
    fetchData(`contracts/documentation/${contractId}/mark-printed-documentation-sent-to-tauron-as-done`, 'PUT'),

  addTauronApprove: (contractId, fetchData) =>
    fetchData(`contracts/documentation/${contractId}/add-tauron-approve`, 'PUT'),

  chooseTermVerificationPerson: (contractId, fetchData, user) => 
    fetchData(
      `contracts/documentation/${contractId}/choose-person-responsible-for-term-verification`,
      'PUT',
      { user }
    ),

  approveTerms: (contractId, fetchData) =>
    fetchData(`contracts/documentation/${contractId}/approve-that-all-terms-are-actual`, 'PUT'),

  completeDocumentation: (contractId, fetchData) =>
    fetchData(`contracts/documentation/${contractId}/complete`, 'PUT'),
};

export default documentationApi; 