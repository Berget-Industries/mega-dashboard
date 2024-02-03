import { Helmet } from 'react-helmet-async';

import IndexView from 'src/sections/ticket-details/view/chat-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Ärende</title>
      </Helmet>

      <IndexView />
    </>
  );
}
