import Container from '@mui/material/Container';

import { useGetUsers } from 'src/api/user';

import UserTable from '../user-table';

// ----------------------------------------------------------------------

export default function OverviewUserView() {
  const { users, usersLoading, usersError } = useGetUsers({});

  return (
    <Container maxWidth="xl">
      <UserTable users={users} />
    </Container>
  );
}
