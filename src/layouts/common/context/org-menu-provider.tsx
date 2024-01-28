import React, { useState, FC, ReactNode, useMemo } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { SelectedOrgContext } from './org-menu-types';

type SelectedOrgContextProviderProps = {
  children: ReactNode;
};

export const SelectedOrgContextProvider: FC<SelectedOrgContextProviderProps> = ({ children }) => {
  const { user } = useAuthContext();
  const [selectedOrg, setSelectedOrg] = useState(user?.organizations[0]);

  const contextValue = useMemo(
    () => ({ selectedOrg, setSelectedOrg }),
    [selectedOrg, setSelectedOrg]
  );

  return <SelectedOrgContext.Provider value={contextValue}>{children}</SelectedOrgContext.Provider>;
};
