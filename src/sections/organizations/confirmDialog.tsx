import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContentText from '@mui/material/DialogContentText';

// eslint-disable-next-line import/no-cycle
import { usePostDeactivatePlugins } from 'src/api/organization';
import { IPlugin } from 'src/types/organization';

interface CreateOrgDialogProps {
  open: boolean;
  handleClose: () => void;
  organization: string;
  organizationId: string;
  plugins: IPlugin[];
}

export default function ConfirmDialog(props: CreateOrgDialogProps) {
  const { open, handleClose, organization, organizationId, plugins } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { deactivatePlugins } = usePostDeactivatePlugins();

  const handleRemove = () => {
    deactivatePlugins(organizationId, plugins);
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
        <DialogContentText>Vill du inaktivera alla plugins för {organization}?</DialogContentText>
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
