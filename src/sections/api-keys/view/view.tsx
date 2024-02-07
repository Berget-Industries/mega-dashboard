import Container from '@mui/material/Container';

import { useGetUsers } from 'src/api/user';
import { useGetOrganizations } from 'src/api/organization';

import APIKeysTable from '../api-keys-table';

// ----------------------------------------------------------------------

export default function OverviewAPIKeysView() {
  const { users, usersLoading, usersError } = useGetUsers({});
  const { organizations, organizationsLoading, organizationsError } = useGetOrganizations({});

  return (
    <Container maxWidth="xl">
      <APIKeysTable users={users} organizations={organizations} />
    </Container>
  );
}
