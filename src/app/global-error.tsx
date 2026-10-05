'use client';

import './globals.css';
import { ErrorView } from '@/components/error-view';

/** Last resort for errors in the root layout itself, so it has to bring its own html and body. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6">
          <ErrorView digest={error.digest} onRetry={reset} />
        </div>
      </body>
    </html>
  );
}
