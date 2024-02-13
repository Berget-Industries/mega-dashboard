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
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    await deactivatePlugins(organizationId, plugins);
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
        <DialogContentText>Vill du inaktivera alla plugins för {organization}?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <span style={{ flexGrow: 1 }}>
          <Button variant="outlined" onClick={handleClose}>
            Avbryt
          </Button>
        </span>
        <LoadingButton color="error" variant="contained" loading={isLoading} onClick={handleRemove}>
          Inaktivera plugins
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
