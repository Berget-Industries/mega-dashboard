import { Helmet } from 'react-helmet-async';

import { JwtResetPassView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Reset Password</title>
      </Helmet>
      <JwtResetPassView />
    </>
  );
}
