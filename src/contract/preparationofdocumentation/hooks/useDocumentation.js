import { useState, useEffect } from 'react';
import useFetch from "../../../useFetch";
import useDataFetching from '../../../useDataFetching';
import documentationApi from '../api/documentationApi';

export const useDocumentation = (contractId) => {
  const { data, isPending, refetch: refetchDocumentation } = 
    useFetch(`contracts/documentation/${contractId}`);
  const { fetchData } = useDataFetching();
  const [documentation, setDocumentation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (data) {
      setDocumentation(data);
    }
  }, [data]);

  const handleApiAction = async (apiCall, successMessage) => {
    setLoading(true);
    try {
      await apiCall();
      refetchDocumentation();
      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Wystąpił błąd',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const approveMap = () => 
    handleApiAction(
      () => documentationApi.approveMap(contractId, fetchData),
      'Mapa została zatwierdzona pomyślnie'
    );

  const completeConsentsVerification = () => 
    handleApiAction(
      () => documentationApi.completeConsentsVerification(contractId, fetchData),
      'Zgody zostały zweryfikowane pomyślnie'
    );

  return {
    documentation,
    setDocumentation,
    loading,
    isPending,
    snackbar,
    setSnackbar,
    approveMap,
    completeConsentsVerification,
    fetchData
  };
}; 