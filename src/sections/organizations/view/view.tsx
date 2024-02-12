import Container from '@mui/material/Container';

import { useGetUsers } from 'src/api/user';
import { useGetOrganizations } from 'src/api/organization';

import OrganizationTable from '../org-table';

// ----------------------------------------------------------------------

export default function OverviewOrganisationView() {
  const { organizations, organizationsLoading, organizationsError } = useGetOrganizations({});
  const { users, usersLoading, usersError } = useGetUsers({});

  return (
    <Container maxWidth="xl">
      <OrganizationTable organizations={organizations} users={users} />
    </Container>
  );
}
