import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField, FormControl } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const token = searchParams.get('token');

  const router = useRouter();
  const { resetPassword } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const onSubmit = async () => {
    if (!token || !password || !confirmPassword) {
      setErrorMsg('Alla fält är obligatoriska.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Lösenorden matchar inte.');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(token, password);
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">Återställ lösenord</Typography>
    </Stack>
  );

  const renderForm = (
    <FormControl>
      <Stack spacing={2.5}>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <TextField
          fullWidth
          label="Nytt lösenord"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          fullWidth
          label="Bekräfta lösenord"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          Återställ lösenord
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
