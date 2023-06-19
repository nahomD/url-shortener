import { useState } from 'react';
import { ShortenedUrl } from '@/utilities/httpClient';
import dynamic from 'next/dynamic';

const Button = dynamic(() => import('@/components/button'), { ssr: false });

export function ShortenedUrlRow({
  shortenedUrl,
}: {
  shortenedUrl: ShortenedUrl;
}) {
  const COPY = 'Copy';
  const [copyButtonText, setCopyButtonText] = useState(COPY);

  return (
    <div role="list" className="pt-4">
      <div
        role="listitem"
        className="flex flex-row justify-between items-center gap-x-2 text-lg"
      >
        <p className="grow">{removeProtocol(shortenedUrl?.longUrl)}</p>
        <a
          className="text-cyan-500 hover:text-cyan-600"
          href={shortenedUrl?.shortUrl}
          target="_blank"
        >
          {removeProtocol(shortenedUrl?.shortUrl)}
        </a>
        <Button
          onClick={onCopyButtonClick}
          className="text-cyan-500 px-4 py-2 hover:bg-slate-100 rounded-md hover:transition-all"
          rippleColor="light"
        >
          {copyButtonText}
        </Button>
      </div>
    </div>
  );

  function removeProtocol(url: string | undefined): string {
    const u = new URL(url || '');
    return u.hostname + u.pathname;
  }

  function onCopyButtonClick() {
    copyShortUrlToClipBoard();
    setCopyButtonText('Copied');
    setCopyButtonTextAfter5Secs();

    function copyShortUrlToClipBoard() {
      navigator.clipboard.writeText(shortenedUrl?.shortUrl ?? '');
    }

    function setCopyButtonTextAfter5Secs() {
      setTimeout(() => setCopyButtonText(COPY), 5000);
    }
  }
}
