import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContentText from '@mui/material/DialogContentText';
import LoadingButton from '@mui/lab/LoadingButton';

interface CreateOrgDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function ConfirmDialog(props: CreateOrgDialogProps) {
  const { open, onClose, onSuccess } = props;
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    if (open === false) {
      setIsLoading(false);
    }
  }, [open]);

  return (
    <Dialog
      fullScreen={fullScreen}
      sx={{ '& .MuiDialog-paper': { width: '30vw', maxHeight: 435 } }}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Bekräfta eliminering av plugin.</DialogTitle>
      <DialogContent>
        <DialogContentText>Är du säker på att du vill ta bort ett plugin?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <LoadingButton
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await onSuccess();
            setIsLoading(false);
          }}
        >
          Ta bort
        </LoadingButton>
        <Button onClick={onClose} color="error" variant="contained">
          Avbryt
        </Button>
      </DialogActions>
    </Dialog>
  );
}
