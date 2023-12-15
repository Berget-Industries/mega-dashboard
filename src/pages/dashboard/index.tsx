import { Helmet } from 'react-helmet-async';

import IndexView from 'src/sections/dashboard/index/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <IndexView />
    </>
  );
}
