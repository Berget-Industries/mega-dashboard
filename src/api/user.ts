import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { poster, fetcher, endpoints } from 'src/utils/axios';

import { IUser } from 'src/types/user';

export function useGetUsers({ users }: { users?: string }) {
  const URL = `${endpoints.admin.userList}${users ? `?users=${users}` : ''}`;
  console.log('Request URL:', URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      users: data?.users || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
    }),
    [data, isLoading, error, isValidating]
  );

  return memoizedValue;
}

export function usePostUsers() {
  const createUser = useCallback(async (userData: IUser) => {
    const response = await poster(endpoints.admin.userCreate, userData);
    console.log('Användare skapades:', response);

    await mutate(endpoints.admin.userList);

    return response;
  }, []);

  return { createUser };
}
