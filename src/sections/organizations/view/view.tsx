import Container from '@mui/material/Container';

import { useGetOrganizations } from 'src/api/organization';

import OrganizationTable from '../org-table';

// ----------------------------------------------------------------------

export default function OverviewOrganisationView() {
  const { organizations, organizationsLoading, organizationsError } = useGetOrganizations({});

  return (
    <Container maxWidth="xl">
      <OrganizationTable organizations={organizations} />
    </Container>
  );
}
