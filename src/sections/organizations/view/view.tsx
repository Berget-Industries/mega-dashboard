import Container from '@mui/material/Container';

import { useGetUsers } from 'src/api/user';
import { useGetExportOrganization, useGetOrganizations } from 'src/api/organization';

import OrganizationTable from '../org-table';

// ----------------------------------------------------------------------

export default function OverviewOrganisationView() {
  const { organizations, organizationsLoading, organizationsError } = useGetOrganizations({});
  const { users, usersLoading, usersError } = useGetUsers({});
  const { organizationData } = useGetExportOrganization({});

  return (
    <Container maxWidth="xl">
      <OrganizationTable
        organizations={organizations}
        users={users}
        organizationData={organizationData}
      />
    </Container>
  );
}
