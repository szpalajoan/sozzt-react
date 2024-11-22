import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n/i18n';

const handleErrorResponse = async (response, t) => {
  const { codeError } = await response.json();
  const errorMessage = t(`${codeError}`) || "Unknown error";
  throw new Error(errorMessage);
};

const useDataFetching = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(); 

  const fetchData = async (url, method, payload, customHeaders = {}) => {
    const username = 'user';
    const password = 'user';
    const headers = new Headers(customHeaders);
    headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
    headers.set('Content-Type', 'application/json');

    try {
      setIsPending(true);

      const config = {
        method: method,
        headers: headers,
        body: null,
      };

      if (payload instanceof FormData) {
        config.body = payload;
        headers.delete('Content-Type');
      } else if (payload) {
        headers.set('Content-Type', 'application/json');
        config.body = JSON.stringify(payload);
      }

      const response = await fetch('http://localhost:8080/api/' + url, config);

      if (!response.ok) {
        await handleErrorResponse(response, t); 
      }
      console.log(url + ' ' + method + ' ' + payload + ' ' + response.status);

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const responseData = await response.json();
          console.log(responseData);
          setData(responseData); 
          return responseData;
        } catch (error) {
          console.error('Błąd podczas parsowania JSON:', error);
          return null;
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return { data, isPending, error, fetchData };
};

export default useDataFetching;
