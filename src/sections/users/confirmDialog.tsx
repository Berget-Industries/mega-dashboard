import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContentText from '@mui/material/DialogContentText';
import { useRemoveUsers } from 'src/api/user';

interface CreateOrgDialogProps {
  open: boolean;
  handleClose: () => void;
  user: string;
  userId: string;
}

export default function ConfirmDialog(props: CreateOrgDialogProps) {
  const { open, handleClose, user, userId } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { removeUser } = useRemoveUsers();

  const handleRemove = () => {
    removeUser(userId);
    handleClose();
  };

  const handleCloseDialog = () => {
    handleClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      sx={{ '& .MuiDialog-paper': { width: '30vw', maxHeight: 435 } }}
      open={open}
      onClose={handleCloseDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Är du säker?</DialogTitle>
      <DialogContent>
        <DialogContentText>Vill du ta bort {user}?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCloseDialog}>
          Avbryt
        </Button>
        <Button onClick={handleRemove} autoFocus sx={{ color: 'error.main' }}>
          Ta bort användare
        </Button>
      </DialogActions>
    </Dialog>
  );
}
