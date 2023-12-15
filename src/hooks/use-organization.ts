import { useState } from 'react';

// Assuming the organization has an id and a name, adjust types as needed
interface Organization {
  id: string;
  name: string;
}

// The hook's function
function useSelectedOrganization() {
  // State to hold the selected organization
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  // Function to update the selected organization
  const selectOrganization = (organization: Organization) => {
    setSelectedOrganization(organization);
  };

  return { selectedOrganization, selectOrganization };
}

export default useSelectedOrganization;
