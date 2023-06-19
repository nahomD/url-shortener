import { ShortenedUrl } from '@/utilities/httpClient';
import { useState } from 'react';
import { UrlInput } from '@/components/urlInput';
import { ShortenedUrlRow } from '@/components/shortenedUrlRow';

export default function Index() {
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl>();

  return (
    <div className="flex flex-col items-center h-screen gap-y-14 justify-center">
      {displayHeader()}
      {displayCard()}
    </div>
  );

  function displayHeader() {
    return (
      <h1 className="text-5xl font-semibold text-sky-600">
        Create Short Links
      </h1>
    );
  }

  function displayCard() {
    return (
      <div className="rounded shadow-xl py-10 px-7">
        <UrlInput
          onShortenedUrl={(shortenedUrl: ShortenedUrl) =>
            setShortenedUrl(shortenedUrl)
          }
        />
        {shortenedUrl && <ShortenedUrlRow shortenedUrl={shortenedUrl} />}
      </div>
    );
  }
}
