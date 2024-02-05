import { Helmet } from 'react-helmet-async';

import OrganizationView from 'src/sections/organizations/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Organisationer</title>
      </Helmet>

      <OrganizationView />
    </>
  );
}
