import Container from '@mui/material/Container';

import {
  useGetAPIKeys,
  useGetOrganizations,
  usePostCreateAPIKeys,
  usePostRemoveAPIKeys,
} from 'src/api/organization';

import SystemAPIKeysTable from '../system-api-keys-table';

// ----------------------------------------------------------------------

export default function OverviewSystemAPIKeysView() {
  const { apiKeys } = useGetAPIKeys({});
  const { organizations } = useGetOrganizations({});

  return (
    <Container maxWidth="xl">
      <SystemAPIKeysTable apiKeys={apiKeys} organizations={organizations} />
    </Container>
  );
}
