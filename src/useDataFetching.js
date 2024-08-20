import { useState } from 'react';

const useDataFetching = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

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
        throw new Error('HTTP error! status: ' + response.status);
      }

      const responseData = await response.json(); // Parse the response data
      setIsPending(false);
      console.log(responseData);
      return responseData; // Return the data so it can be used later

    } catch (error) {
      setError(error.message);
      setIsPending(false);
      throw error; // Re-throw the error to be handled in the calling function
    }
  };

  return { data, isPending, error, fetchData };
};

export default useDataFetching;