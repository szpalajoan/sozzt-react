import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n/i18n';

const handleErrorResponse = async (response, t) => {
  const { codeError } = await response.json();
  const errorMessage = t(`${codeError}`) || "Unknown error";
  throw new Error(errorMessage);
};

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation(); 

  const fetchData = async () => {
    const username = 'user';
    const password = 'user';
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));

    try {
      const response = await fetch('http://localhost:8080/api/' + url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        await handleErrorResponse(response, t); 
      }

      const data = await response.json();
      setData(data);
      setIsPending(false);
    } catch (error) {
      setError(error.message);
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

 
  const refetch = () => {
    console.log('refetch');
    setIsPending(true); 
    fetchData();
  };

  return { data, isPending, error, refetch }; 
};

export default useFetch;
