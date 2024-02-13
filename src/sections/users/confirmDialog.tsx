import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContentText from '@mui/material/DialogContentText';
import LoadingButton from '@mui/lab/LoadingButton';
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
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    await removeUser(userId);
    setIsLoading(false);
    handleClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      sx={{ '& .MuiDialog-paper': { width: '30vw', maxHeight: 435 } }}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Är du säker?</DialogTitle>
      <DialogContent>
        <DialogContentText>Vill du ta bort {user}?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <span style={{ flexGrow: 1 }}>
          <Button variant="outlined" autoFocus onClick={handleClose}>
            Avbryt
          </Button>
        </span>
        <LoadingButton
          color="error"
          variant="contained"
          loading={isLoading}
          onClick={handleRemove}
          autoFocus
        >
          Ta bort användare
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
