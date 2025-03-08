import { useState, useEffect } from 'react';
import useDataFetching from '../../../useDataFetching';
import useFetch from '../../../useFetch';
import routePreparationApi from '../api/routePreparationApi';

export const useRoutePreparation = (contractId) => {
  const [routePreparation, setRoutePreparation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { fetchData } = useDataFetching();
  const { data, isPending, refetch } = useFetch(`contracts/route-preparation/${contractId}`);

  useEffect(() => {
    if (data) {
      setRoutePreparation(data);
    }
  }, [data]);

  const handleSuccess = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
  };

  const handleError = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const approveMap = async () => {
    setLoading(true);
    try {
      await routePreparationApi.approveMap(contractId, fetchData);
      refetch();
      handleSuccess('Mapa została zatwierdzona pomyślnie');
    } catch (error) {
      handleError(error.message || 'Wystąpił błąd podczas zatwierdzania mapy');
    } finally {
      setLoading(false);
    }
  };

  const completeRoutePreparation = async () => {
    setLoading(true);
    try {
      await routePreparationApi.completeRoutePreparation(contractId, fetchData);
      refetch();
      handleSuccess('Przygotowanie trasy zostało zakończone pomyślnie');
      return true;
    } catch (error) {
      handleError(error.message || 'Wystąpił błąd podczas finalizacji przygotowania trasy');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    routePreparation,
    setRoutePreparation,
    loading,
    isPending,
    snackbar,
    setSnackbar,
    approveMap,
    completeRoutePreparation,
    fetchData,
    refetch
  };
}; 