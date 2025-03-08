const routePreparationApi = {
  // Pobranie informacji o przygotowaniu trasy
  getRoutePreparation: (contractId, fetchData) => 
    fetchData(`contracts/route-preparation/${contractId}`, 'GET'),

  // Zatwierdzenie poprawności mapy
  approveMap: (contractId, fetchData) => 
    fetchData(`contracts/route-preparation/${contractId}/approve-correctness-of-the-map`, 'POST'),

  // Wybór osoby odpowiedzialnej za rysowanie trasy
  chooseRouteDrawingPerson: (contractId, fetchData, user) => 
    fetchData(
      `contracts/route-preparation/${contractId}/choose-person-responsible-for-route-drawing`,
      'POST',
      { user }
    ),

  // Wgranie rozrysowanej trasy
  uploadDrawnRoute: (contractId, fetchData, formData) =>
    fetchData(`contracts/route-preparation/${contractId}/drawn-route`, 'POST', formData),

  // Wgranie PDF z trasą i danymi
  uploadPdfWithRoute: (contractId, fetchData, formData) =>
    fetchData(`contracts/route-preparation/${contractId}/pdf-with-route-and-data`, 'POST', formData),

  // Zakończenie etapu przygotowania trasy
  completeRoutePreparation: (contractId, fetchData) =>
    fetchData(`contracts/route-preparation/${contractId}/complete`, 'PUT')
};

export default routePreparationApi; 