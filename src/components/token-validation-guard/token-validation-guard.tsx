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
        setIsValid(false);
        return;
      }

      try {
        const response = await checkIfTokenIsValid(token);
        setIsValid((response as { isValid: boolean }).isValid);
      } catch (error) {
        setIsValid(false);
      }
    };

    validateToken();
  }, [token, checkIfTokenIsValid]);

  if (!isValid) {
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

  return <>{children}</>;
};

export default TokenValidationGuard;
