import { Helmet } from 'react-helmet-async';

import OverviewAPIKeysView from 'src/sections/api-keys/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>API Nycklar</title>
      </Helmet>

      <OverviewAPIKeysView />
    </>
  );
}
