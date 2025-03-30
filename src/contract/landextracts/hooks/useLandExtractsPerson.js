import { useState } from 'react';
import landExtractsApi from '../api/landExtractsApi';

export const useLandExtractsPerson = (
  landExtracts,
  setLandExtracts,
  contractId,
  fetchData,
  handleSuccess,
  handleError
) => {
  const [personResponsible, setPersonResponsible] = useState('');
  const [isEditingPerson, setIsEditingPerson] = useState(false);

  // Mocked list of people - in real app this would come from an API
  const availablePersons = [
    { user: '1', name: 'Jan Kowalski' },
    { user: '2', name: 'Anna Nowak' },
    { user: '3', name: 'Piotr Wiśniewski' },
    { user: '4', name: 'Maria Dąbrowska' },
  ];

  const handlePersonResponsibleChange = async () => {
    try {
      // Here you would typically make an API call to save the assigned person
      setIsEditingPerson(false);
      handleSuccess('Pomyślnie przypisano osobę');
    } catch (error) {
      handleError(error.message || 'Wystąpił błąd podczas przypisywania osoby');
    }
  };

  return {
    personResponsible,
    setPersonResponsible,
    isEditingPerson,
    setIsEditingPerson,
    availablePersons,
    handlePersonResponsibleChange
  };
}; 