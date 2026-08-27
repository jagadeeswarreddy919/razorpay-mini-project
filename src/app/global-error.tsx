'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#090d16', color: '#ffffff', fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
        <h2>Application Error</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{error?.message || 'An unhandled error occurred.'}</p>
        <button
          onClick={() => reset()}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem' }}
        >
          Reload Page
        </button>
      </body>
    </html>
  );
}
