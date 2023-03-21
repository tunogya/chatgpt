// _error
// This is the custom error page. It is used to display an error message when
// an error occurs during the rendering of a page. It is only used in production.
// See https://nextjs.org/docs/advanced-features/custom-error-page for more info.

import React from 'react';
import {NextPage} from 'next';
import {useRouter} from 'next/router';

const Error: NextPage = () => {
  const router = useRouter();
  return (
    <div className={''}>
      <h1>404</h1>
      <h2>Page not found</h2>
      <button onClick={() => router.push('/')}>Go to home</button>
    </div>
  );
};

export default Error;