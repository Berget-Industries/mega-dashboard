import { Helmet } from 'react-helmet-async';

import SendMail from 'src/sections/send-mail/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Skicka Mail</title>
      </Helmet>

      <SendMail />
    </>
  );
}
