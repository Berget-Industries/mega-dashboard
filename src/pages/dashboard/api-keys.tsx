import { Helmet } from 'react-helmet-async';

import OverviewAnalyticsView from 'src/sections/analytics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>API Nycklar</title>
      </Helmet>

      <OverviewAnalyticsView />
    </>
  );
}
