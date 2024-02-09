import React, { createContext, ReactNode } from 'react';

import { IOrganization } from 'src/types/organization';

export type SelectedOrgContextType = [IOrganization | undefined, (id: string) => void];

export const SelectedOrgContext = createContext<SelectedOrgContextType>([undefined, () => {}]);
