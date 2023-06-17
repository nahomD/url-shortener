import { ShortenedUrl, shortenUrl } from '@/utilities/httpClient';
import { KeyboardEvent, useState } from 'react';
import isUrlHttp from 'is-url-http';
import dynamic from 'next/dynamic';

const Button = dynamic(() => import('@/components/button'), { ssr: false });

export default function Index() {
  const [link, setLink] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center h-screen gap-y-14 justify-center">
      <h1 className="text-5xl font-semibold text-sky-600">
        Create Short Links
      </h1>
      <div className="rounded shadow-xl py-10 px-7">
        <div
          className={`flex gap-2 bg-slate-100 p-5 rounded-lg border-2 ${
            error ? 'border-red-400' : 'border-transparent'
          }`}
        >
          <svg
            fill="#000000"
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 my-auto stroke-slate-50"
          >
            <path d="M9.239 22.889c0.195 0.195 0.451 0.293 0.707 0.293s0.511-0.098 0.707-0.293l12.114-12.209c0.39-0.39 0.39-1.024 0-1.414s-1.023-0.39-1.414 0l-12.114 12.209c-0.391 0.39-0.391 1.023 0 1.414zM14.871 20.76c0.331 1.457-0.026 2.887-1.152 4.014l-4.039 3.914c-0.85 0.849-1.98 1.317-3.182 1.317s-2.332-0.468-3.182-1.317c-1.754-1.755-1.754-4.61-0.010-6.354l3.946-4.070c0.85-0.849 1.98-1.318 3.182-1.318 0.411 0 0.807 0.073 1.193 0.179l1.561-1.561c-0.871-0.407-1.811-0.619-2.754-0.619-1.663 0-3.327 0.635-4.596 1.904l-3.936 4.061c-2.538 2.538-2.538 6.654 0 9.193 1.269 1.27 2.933 1.904 4.596 1.904s3.327-0.634 4.596-1.904l4.030-3.904c1.942-1.942 2.361-4.648 1.333-7.023zM30.098 1.899c-1.27-1.269-2.933-1.904-4.596-1.904-1.664 0-3.328 0.635-4.596 1.904l-4.029 3.905c-2.012 2.013-2.423 5.015-1.244 7.439l1.552-1.552c-0.459-1.534-0.107-3.261 1.096-4.463l4.039-3.914c0.851-0.849 1.98-1.318 3.183-1.318 1.201 0 2.332 0.469 3.181 1.318 1.754 1.755 1.754 4.611 0.010 6.354l-4.039 4.039c-0.849 0.85-1.98 1.317-3.181 1.317-0.306 0-0.576 0.031-0.87-0.029l-1.593 1.594c0.796 0.331 1.613 0.436 2.463 0.436 1.663 0 3.326-0.634 4.596-1.904l4.029-4.029c2.538-2.538 2.538-6.653-0-9.192z"></path>
          </svg>
          <input
            type="text"
            name="url"
            id="url"
            placeholder="Enter link"
            onChange={(e) => setLink(e.target.value)}
            className="w-96 bg-transparent border-none h-12 text-lg focus:outline-none text-cyan-500"
            value={link}
            autoFocus
            onKeyDown={async (event) => {
              if (IsEnterKey(event)) await submit();
            }}
          />
          <Button
            rippleColor="light"
            className={`${
              isLoading &&
              'cursor-not-allowed bg-cyan-500/60 hover:bg-cyan-500/60 hover:shadow-cyan-500/40'
            } w-28 h-12 px-6 py-2 text-white text-lg transition duration-150 ease-in-out rounded-lg bg-cyan-500 shadow-md shadow-cyan-500/40 hover:shadow-cyan-500/80 hover:bg-cyan-600`}
            onClick={async () => {
              await submit();
            }}
            disabled={isLoading}
            data-testid="shorten-button"
          >
            {isLoading ? (
              <div
                className="align-middle inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            ) : (
              'Shorten'
            )}
          </Button>
        </div>
        {error && <p className="text-red-600 text-sm pt-2">{error}</p>}
        {shortenedUrl && (
          <div role="list" className="pt-4">
            <div
              role="listitem"
              className="flex flex-row justify-between items-center gap-x-2 text-lg"
            >
              <p className="grow">{removeProtocol(shortenedUrl.longUrl)}</p>
              <a
                className="text-cyan-500 hover:text-cyan-600"
                href={shortenedUrl.shortUrl}
                target="_blank"
              >
                {removeProtocol(shortenedUrl.shortUrl)}
              </a>
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(shortenedUrl.shortUrl)
                }
                className="text-cyan-500 px-4 py-2 hover:bg-slate-100 rounded-md hover:transition-all"
                rippleColor="light"
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function IsEnterKey(event: KeyboardEvent<HTMLInputElement>) {
    return event.key === 'Enter';
  }

  function removeProtocol(url: string): string {
    const u = new URL(url);
    return u.hostname + u.pathname;
  }
  async function submit() {
    if (isUrlHttp(link)) await sendRequest();
    else if (link === '') setError('Link is required');
    else setError('Invalid Link');
  }

  async function sendRequest() {
    setIsLoading(true);
    setShortenedUrl(await shortenUrl(link));
    setIsLoading(false);
    setLink('');
    setError('');
  }
}
