import * as Yup from 'yup';
import { useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { TextField, FormControl, IconButton } from '@mui/material';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useRequestPassLink } from 'src/api/user';

// ----------------------------------------------------------------------

export default function JwtResetPassView() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { requestLink } = useRequestPassLink();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [email, setEmail] = useState<string>('');

  const onSubmit = async () => {
    if (!email) {
      setErrorMsg('Fyll i fältet nedan.');
      return;
    }

    try {
      setIsLoading(true);
      await requestLink(email);
      setSuccessMsg('Skickat! Kolla din mailkorg.');
      // router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Stack alignItems="flex-start">
        <IconButton sx={{ mb: 2 }} onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton>
      </Stack>
      <Typography variant="h4">Skicka återställningslänk</Typography>
    </Stack>
  );

  const renderForm = (
    <FormControl>
      <Stack spacing={2.5}>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        <TextField
          fullWidth
          label="E-postadress"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="button"
          onClick={onSubmit}
          variant="contained"
          loading={isLoading}
        >
          Skicka länk
        </LoadingButton>
      </Stack>
    </FormControl>
  );

  return (
    <>
      {renderHead}
      {renderForm}
    </>
  );
}
