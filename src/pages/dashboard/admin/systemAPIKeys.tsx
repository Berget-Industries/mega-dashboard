import { Helmet } from 'react-helmet-async';
import OverviewSystemAPIKeysView from 'src/sections/system-api-keys/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>System API Nycklar</title>
      </Helmet>
      <OverviewSystemAPIKeysView />
    </>
  );
}
