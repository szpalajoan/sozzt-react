import { useState, useEffect } from 'react';
import documentationApi from '../api/documentationApi';

export const useTermVerification = (documentation, setDocumentation, contractId, fetchData, onSuccess, onError) => {
  const [personResponsible, setPersonResponsible] = useState('');
  const [isEditingPerson, setIsEditingPerson] = useState(false);

  useEffect(() => {
    if (documentation?.termVerification?.verifierName) {
      setPersonResponsible(documentation.termVerification.verifierName);
    }
  }, [documentation]);

  const handlePersonChange = async () => {
    try {
      await documentationApi.chooseTermVerificationPerson(contractId, fetchData, personResponsible);
      setIsEditingPerson(false);
      setDocumentation(prev => ({
        ...prev,
        termVerification: {
          ...prev.termVerification,
          verifierName: personResponsible
        }
      }));
      onSuccess('Osoba odpowiedzialna została wybrana pomyślnie');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas wybierania osoby odpowiedzialnej');
    }
  };

  const handleApproveTerms = async () => {
    try {
      await documentationApi.approveTerms(contractId, fetchData);
      setDocumentation(prev => ({
        ...prev,
        termVerification: {
          ...prev.termVerification,
          areAllTermsActual: true
        }
      }));
      onSuccess('Terminy zostały zatwierdzone pomyślnie');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas zatwierdzania terminów');
    }
  };

  const handleComplete = async () => {
    try {
      await documentationApi.completeDocumentation(contractId, fetchData);
      onSuccess('Dokumentacja została zakończona pomyślnie');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas kończenia dokumentacji');
    }
  };

  return {
    personResponsible,
    setPersonResponsible,
    isEditingPerson,
    setIsEditingPerson,
    handlePersonChange,
    handleApproveTerms,
    handleComplete,
    canComplete: documentation?.termVerification?.areAllTermsActual
  };
}; 