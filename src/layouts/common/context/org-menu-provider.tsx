import { useState, FC, ReactNode, useMemo, useCallback } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { IOrganization } from 'src/types/organization';
import { SelectedOrgContext, SelectedOrgContextType } from './org-menu-types';

type SelectedOrgContextProviderProps = {
  children: ReactNode;
};

export const SelectedOrgContextProvider: FC<SelectedOrgContextProviderProps> = ({ children }) => {
  const { user } = useAuthContext();
  const [selectedOrg, setSelectedOrg] = useState<IOrganization | undefined>(user?.organizations[0]);

  const selectOrg = useCallback(
    (id: string) => {
      const foundOrg = user?.organizations.find((org: any) => org._id === id);
      setSelectedOrg(foundOrg);
    },
    [user]
  );

  const contextValue = useMemo(
    () => [selectedOrg, selectOrg] as SelectedOrgContextType,
    [selectedOrg, selectOrg]
  );

  return <SelectedOrgContext.Provider value={contextValue}>{children}</SelectedOrgContext.Provider>;
};
