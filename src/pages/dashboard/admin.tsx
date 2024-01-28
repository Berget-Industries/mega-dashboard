import { Helmet } from 'react-helmet-async';

import SettingsView from 'src/sections/settings/view';
import AdminView from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Admin</title>
      </Helmet>

      <AdminView />
    </>
  );
}
