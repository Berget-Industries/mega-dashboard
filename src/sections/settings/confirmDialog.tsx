import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContentText from '@mui/material/DialogContentText';

interface CreateOrgDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ConfirmDialog(props: CreateOrgDialogProps) {
  const { open, onClose, onSuccess } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
        <Button onClick={onSuccess}>Ta bort</Button>
        <Button onClick={onClose} color="error" variant="contained">
          Avbryt
        </Button>
      </DialogActions>
    </Dialog>
  );
}
