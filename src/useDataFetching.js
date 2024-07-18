import { useState } from 'react';

const useDataFetching = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (method, payload) => {
    const username = 'user';
    const password = 'user';
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
    headers.set('Content-Type', 'application/json');

    try {
      setIsPending(true);
      const response = await fetch('http://localhost:8080/api/' + url, {
        method: method,
        headers: headers,
        body: method === 'POST' ? JSON.stringify(payload) : null
      });

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      if (method === 'GET') {
        const data = await response.json();
        setData(data);
      }

      setIsPending(false);
    } catch (error) {
      setError(error.message);
      setIsPending(false);
    }
  };

  return { data, isPending, error, fetchData };
};

export default useDataFetching;
