import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function useSelectedOrganization() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);

  // Hook to update state when the URL changes
  useEffect(() => {
    const organizationId = searchParams.get('organization');
    setSelectedOrganization(organizationId);
  }, [searchParams]);

  // Function to update the URL when the organization is selected
  const selectOrganization = (id: string) => {
    const newSearchParams = searchParams;
    newSearchParams.set('organization', id);
    setSearchParams(newSearchParams);
  };

  return { selectedOrganization, selectOrganization };
}

export default useSelectedOrganization;
