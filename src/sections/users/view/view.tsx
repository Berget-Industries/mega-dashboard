import Container from '@mui/material/Container';

import { useGetUsers } from 'src/api/user';
import { useGetOrganizations } from 'src/api/organization';

import UserTable from '../user-table';

// ----------------------------------------------------------------------

export default function OverviewUserView() {
  const { users, usersLoading, usersError } = useGetUsers({});
  const { organizations, organizationsLoading, organizationsError } = useGetOrganizations({});

  return (
    <Container maxWidth="xl">
      <UserTable users={users} organizations={organizations} />
    </Container>
  );
}
