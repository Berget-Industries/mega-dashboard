import { Helmet } from 'react-helmet-async';
import OverviewUserView from 'src/sections/users/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Användare</title>
      </Helmet>
      <OverviewUserView />
    </>
  );
}
