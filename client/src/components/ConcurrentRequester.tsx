import React, { useCallback, useRef, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const totalRequests = 1000;

const ConcurrentRequester: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  const sendedRequestsPerSecondCount = useRef(0);
  const sendedRequestsCount = useRef(0);
  const currentIndex = useRef(0);

  const handleClick = useCallback(() => {
    setLoading(true);
    setResults([]);

    sendedRequestsPerSecondCount.current = 0;
    sendedRequestsCount.current = 0;
    currentIndex.current = 0;

    const concurrencyLimit = parseInt(inputValue);
    const requestsPerSecondLimit = parseInt(inputValue);

    const sendRequestIfCan = () => {
      if (currentIndex.current <= totalRequests)
      {
        if(sendedRequestsPerSecondCount.current < requestsPerSecondLimit 
          && sendedRequestsCount.current < concurrencyLimit)
        sendRequest();
      }
      else
        setLoading(false);
    }

    const sendRequest = () => {
      if(currentIndex.current > totalRequests)
        return;

      sendedRequestsPerSecondCount.current++;
      sendedRequestsCount.current++;
      currentIndex.current++;

      setTimeout(() => {
        sendedRequestsPerSecondCount.current--;
        sendRequestIfCan();
      }, 1000);

      axiosInstance.post('/', { index: currentIndex.current })
        .then(response => {
          setResults(prevResults => [...prevResults, response.data.index]);
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          sendedRequestsCount.current--;
          sendRequestIfCan();
      })
    }

    for (let i = 0; i < concurrencyLimit; i++) {
      sendRequest();
    }
  }, [inputValue]);

  return (
    <div>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        min={0}
        max={100}
        required
        style={{margin: 5}}
      />
      <button onClick={handleClick} disabled={loading}>Start</button>
      <ul>
        {results.map(result => (
          <li key={result}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConcurrentRequester;
