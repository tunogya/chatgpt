// _error
// This is the custom error page. It is used to display an error message when
// an error occurs during the rendering of a page. It is only used in production.
// See https://nextjs.org/docs/advanced-features/custom-error-page for more info.

import React from 'react';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import AbandonIcon from "@/components/SVG/AbandonIcon";

const Error: NextPage = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white">
      <div className="w-96 flex flex-col justify-center items-center">
        <h1>404</h1>
        <div className="mt-2 mb-5">
          <AbandonIcon width={'140'}/>
        </div>
        <a className="mb-2 text-center text-sm underline cursor-pointer" onClick={() => router.push('/')}>Go to home</a>
      </div>
    </div>
  );
};

export default Error;