import { useState, useEffect } from 'react';
import useDataFetching from '../../../useDataFetching';
import useFetch from '../../../useFetch';
import landExtractsApi from '../api/landExtractsApi';

export const useLandExtracts = (contractId) => {
  const [landExtracts, setLandExtracts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { fetchData } = useDataFetching();
  const { data, isPending, refetch } = useFetch(`contracts/land-extracts/${contractId}`);

  useEffect(() => {
    if (data) {
      setLandExtracts(data);
    }
  }, [data]);

  const handleSuccess = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
  };

  const handleError = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const requestForLandExtractsSent = async () => {
    setLoading(true);
    try {
      await landExtractsApi.requestForLandExtractsSent(contractId, fetchData);
      refetch();
      handleSuccess('Wysłano prośbę o wypisy');
    } catch (error) {
      handleError(error.message || 'Wystąpił błąd podczas wysyłania prośby o wypisy');
    } finally {
      setLoading(false);
    }
  };

  const completeLandExtracts = async () => {
    setLoading(true);
    try {
      await landExtractsApi.completeLandExtracts(contractId, fetchData);
      refetch();
      handleSuccess('Wypisy zostały zakończone pomyślnie');
      return true;
    } catch (error) {
      handleError(error.message || 'Wystąpił błąd podczas finalizacji wypisów');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    landExtracts,
    setLandExtracts,
    loading,
    isPending,
    snackbar,
    setSnackbar,
    requestForLandExtractsSent,
    completeLandExtracts,
    fetchData,
    refetch
  };
}; 