import React, { useState, ReactNode, useEffect } from 'react';

import { Stack, Container } from '@mui/system';

import NotFoundPage from 'src/pages/404';
import { usePostCheckIfTokenValid } from 'src/api/register';

import { MotionContainer } from '../animate';

interface TokenValidationGuardProps {
  children: ReactNode;
}

const TokenValidationGuard: React.FC<TokenValidationGuardProps> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const { checkIfTokenIsValid } = usePostCheckIfTokenValid();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        console.log('No token found in URL');
        return;
      }

      console.log('Token found:', token);

      try {
        const response = await checkIfTokenIsValid(token);
        console.log('API response:', response);
        setIsValid(true);
      } catch (error) {
        console.error('Error during token validation:', error);
        setIsValid(false);
      }
    };

    validateToken();
  }, [token, checkIfTokenIsValid]);

  if (!isValid) {
    console.log('Token is not valid or validation failed');
    return (
      <Container
        component={MotionContainer}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '85vh',
          textAlign: 'center',
        }}
      >
        <Stack>
          <NotFoundPage />
        </Stack>
      </Container>
    );
  }

  console.log('Token is valid, rendering children');
  return <>{children}</>;
};

export default TokenValidationGuard;
