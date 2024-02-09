import Container from '@mui/material/Container';

import { useGetAPIKeys, usePostCreateAPIKeys, usePostRemoveAPIKeys } from 'src/api/organization';

import SystemAPIKeysTable from '../system-api-keys-table';

// ----------------------------------------------------------------------

export default function OverviewSystemAPIKeysView() {
  const { apiKeys } = useGetAPIKeys({});

  return (
    <Container maxWidth="xl">
      <SystemAPIKeysTable apiKeys={apiKeys} />
    </Container>
  );
}
