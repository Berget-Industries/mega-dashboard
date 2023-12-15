import { Helmet } from 'react-helmet-async';

import TicketsView from 'src/sections/tickets/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Tickets</title>
      </Helmet>

      <TicketsView />
    </>
  );
}
