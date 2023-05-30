import { fetch } from '@/utilities/httpClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [failure, setFailure] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const greeting = await fetch('/api');
        setGreeting(greeting);
      } catch (error) {
        setFailure('Something went wrong');
      }
    })();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen text-2xl">
      {greeting && <h1>{greeting}</h1>}
      {failure && (
        <div role="error" className="text-red-400">
          {failure}
        </div>
      )}
    </div>
  );
}
