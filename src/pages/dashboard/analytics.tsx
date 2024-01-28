import { Helmet } from 'react-helmet-async';

import OverviewAnalyticsView from 'src/sections/analytics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Statistik</title>
      </Helmet>

      <OverviewAnalyticsView />
    </>
  );
}
