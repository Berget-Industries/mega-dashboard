import { useContext } from 'react';

import { SelectedOrgContext } from './org-menu-types';

export const useSelectedOrgContext = () => {
  const context = useContext(SelectedOrgContext);
  if (!context) {
    throw new Error('useOrgMenuContext must be used within an OrgMenuContextProvider');
  }
  return context;
};
