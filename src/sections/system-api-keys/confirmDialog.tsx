import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContentText from '@mui/material/DialogContentText';
import { useRemoveUsers } from 'src/api/user';
import { IAPIKeys } from 'src/types/APIKeys';
import { usePostRemoveAPIKeys } from 'src/api/organization';

interface CreateAPIKeyDialogProps {
  open: boolean;
  handleClose: () => void;
  apiKeys: string;
  apiKeysId: string;
}

export default function ConfirmDialog(props: CreateAPIKeyDialogProps) {
  const { open, handleClose, apiKeys, apiKeysId } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { removeAPIKey } = usePostRemoveAPIKeys();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRemoveAPIKey = async () => {
    try {
      setIsLoading(true);
      await removeAPIKey({ apiKeyId: apiKeysId });
      handleClose();
    } catch (error) {
      console.error('Error removing API key:', error);
    } finally {
      setIsLoading(false);
    }
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
        <DialogContentText>Vill du ta bort {apiKeysId}?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <span style={{ flexGrow: 1 }}>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Avbryt
          </Button>
        </span>
        <LoadingButton
          loading={isLoading}
          onClick={handleRemoveAPIKey}
          variant="contained"
          color="error"
        >
          Ta bort nyckel
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
