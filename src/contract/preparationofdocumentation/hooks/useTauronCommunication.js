import documentationApi from '../api/documentationApi';

export const useTauronCommunication = (contractId, fetchData, setDocumentation, onSuccess, onError) => {
  const handleMarkSent = async () => {
    try {
      await documentationApi.markDocumentationSentToTauron(contractId, fetchData);
      setDocumentation(prev => ({
        ...prev,
        tauronCommunication: {
          ...prev.tauronCommunication,
          printedDocumentationSentToTauron: true
        }
      }));
      onSuccess('Dokumentacja została oznaczona jako wysłana do Tauronu');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas oznaczania dokumentacji jako wysłanej');
    }
  };

  const handleMarkApproved = async () => {
    try {
      await documentationApi.addTauronApprove(contractId, fetchData);
      setDocumentation(prev => ({
        ...prev,
        tauronCommunication: {
          ...prev.tauronCommunication,
          approvedByTauron: true
        }
      }));
      onSuccess('Dokumentacja została oznaczona jako zaakceptowana przez Tauron');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas oznaczania dokumentacji jako zaakceptowanej');
    }
  };

  return {
    handleMarkSent,
    handleMarkApproved
  };
}; 