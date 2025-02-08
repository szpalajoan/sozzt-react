import { useState, useEffect } from 'react';
import documentationApi from '../api/documentationApi';

export const useRouteDrawingPerson = (documentation, setDocumentation, contractId, fetchData, onSuccess, onError) => {
  const [personResponsible, setPersonResponsible] = useState('');
  const [isEditingPerson, setIsEditingPerson] = useState(false);

  useEffect(() => {
    if (documentation?.routeDrawing?.drawingBy) {
      setPersonResponsible(documentation.routeDrawing.drawingBy);
    }
  }, [documentation]);

  const handlePersonResponsibleChange = async () => {
    try {
      await documentationApi.chooseRouteDrawingPerson(contractId, fetchData, personResponsible);
      setIsEditingPerson(false);
      setDocumentation(prev => ({
        ...prev,
        routeDrawing: {
          ...prev.routeDrawing,
          drawingBy: personResponsible
        }
      }));
      onSuccess('Osoba odpowiedzialna została wybrana pomyślnie');
    } catch (error) {
      onError(error.message || 'Wystąpił błąd podczas wybierania osoby odpowiedzialnej');
    }
  };

  return {
    personResponsible,
    setPersonResponsible,
    isEditingPerson,
    setIsEditingPerson,
    handlePersonResponsibleChange
  };
}; 