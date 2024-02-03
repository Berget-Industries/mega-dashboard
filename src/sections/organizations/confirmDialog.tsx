import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface CreateOrgDialogProps {
  open: boolean;
  handleClose: () => void;
  organization: string;
}

export default function ConfirmDialog(props: CreateOrgDialogProps) {
  const { open, handleClose, organization } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleRemove = () => {
    console.log('Removed Org');
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
        <DialogContentText>Vill du inaktivera {organization}?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCloseDialog}>
          Avbryt
        </Button>
        <Button onClick={handleRemove} autoFocus>
          Inaktivera
        </Button>
      </DialogActions>
    </Dialog>
  );
}
