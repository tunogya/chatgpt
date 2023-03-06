// _error
// This is the custom error page. It is used to display an error message when
// an error occurs during the rendering of a page. It is only used in production.
// See https://nextjs.org/docs/advanced-features/custom-error-page for more info.

import React from 'react';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {Button, Heading, Stack} from '@chakra-ui/react';

const Error: NextPage = () => {
  const router = useRouter();
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      h="100vh"
    >
      <Heading>404</Heading>
      <Heading>Page not found</Heading>
      <Button onClick={() => router.push('/')}>Go to home</Button>
    </Stack>
  );
};

export default Error;