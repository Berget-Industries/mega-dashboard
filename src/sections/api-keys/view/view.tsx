import Container from '@mui/material/Container';

import { useGetAPIKeys, usePostCreateAPIKeys, usePostRemoveAPIKeys } from 'src/api/organization';

import APIKeysTable from '../api-keys-table';

// ----------------------------------------------------------------------

export default function OverviewAPIKeysView() {
  const { apiKeys } = useGetAPIKeys({});

  return (
    <Container maxWidth="xl">
      <APIKeysTable apiKeys={apiKeys} />
    </Container>
  );
}
