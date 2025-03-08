import { useState, useEffect } from 'react';
import routePreparationApi from '../api/routePreparationApi';

export const useRouteDrawingPerson = (routePreparation, setRoutePreparation, contractId, fetchData, onSuccess, onError) => {
  const [personResponsible, setPersonResponsible] = useState('');
  const [isEditingPerson, setIsEditingPerson] = useState(false);

  // Dostępne osoby (w rzeczywistej aplikacji pobierane z API)
  const availablePersons = [
    { name: "Jan Kowalski", user: "jan.kowalski" },
    { name: "Anna Nowak", user: "anna.nowak" },
    { name: "Piotr Wiśniewski", user: "piotr.wisniewski" }
  ];

  useEffect(() => {
    if (routePreparation?.routeDrawing?.drawingBy) {
      setPersonResponsible(routePreparation.routeDrawing.drawingBy);
    }
  }, [routePreparation]);

  const handlePersonResponsibleChange = async () => {
    try {
      await routePreparationApi.chooseRouteDrawingPerson(contractId, fetchData, personResponsible);
      setIsEditingPerson(false);
      setRoutePreparation(prev => ({
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
    handlePersonResponsibleChange,
    availablePersons
  };
}; 