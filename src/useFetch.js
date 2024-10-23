import React, { useEffect, useState } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  // Funkcja do pobierania danych
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
        throw new Error('HTTP error! status: ' + response.status);
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
    setIsPending(true); 
    fetchData();
  };

  return { data, isPending, error, refetch }; 
};

export default useFetch;
