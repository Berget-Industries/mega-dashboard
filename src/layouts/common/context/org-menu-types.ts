import React, { createContext, ReactNode } from 'react';

interface Organization {
  _id: string;
  name: string;
  logoUrl: string;
}

interface SelectedOrgContextType {
  selectedOrg: Organization | undefined;
  setSelectedOrg: (org: Organization) => void;
}

export const SelectedOrgContext = createContext<SelectedOrgContextType>({
  selectedOrg: undefined,
  setSelectedOrg: () => {},
});
