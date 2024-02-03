import React, { createContext, ReactNode } from 'react';

import { IOrganization } from 'src/types/organization';

interface SelectedOrgContextType {
  selectedOrg: IOrganization | undefined;
  setSelectedOrg: (org: IOrganization) => void;
}

export const SelectedOrgContext = createContext<SelectedOrgContextType>({
  selectedOrg: undefined,
  setSelectedOrg: () => {},
});
