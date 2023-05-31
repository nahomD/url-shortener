import { shortenUrl } from '@/utilities/httpClient';
import { useState } from 'react';
import isUrlHttp from 'is-url-http';

export default function Index() {
  const [link, setLink] = useState('');

  return (
    <>
      <h1>Create Short Links</h1>
      <input
        type="text"
        name="url"
        id="url"
        placeholder="Enter link"
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        onClick={async () => {
          if (isUrlHttp(link)) await shortenUrl('/api/urls', link);
        }}
      >
        Shorten
      </button>
    </>
  );
}
