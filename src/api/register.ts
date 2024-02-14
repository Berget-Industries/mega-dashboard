import { useCallback } from 'react';
import { endpoints, poster } from 'src/utils/axios';

export function usePostCheckIfTokenValid() {
  const checkIfTokenIsValid = useCallback(async (token: string) => {
    const response = await poster(endpoints.auth.checkIfTokenIsValid, token);
    console.log('Kollade om token är valid:', response);

    return response;
  }, []);

  return { checkIfTokenIsValid };
}
