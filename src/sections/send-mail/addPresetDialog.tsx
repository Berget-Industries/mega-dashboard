import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Container, TextField, Snackbar, SnackbarCloseReason } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';

interface AddPresetProps {
  open: boolean;
  onClose: () => void;
  instruction: string;
  setInstruction: (instruction: string) => void;
  setPresets: (options: { name: string; description: string }[]) => void;
  presets: { name: string; description: string }[];
  presetName: string;
  setPresetName: (presetName: string) => void;
}

export default function AddPresetDialog(props: AddPresetProps) {
  const {
    open,
    onClose,
    instruction,
    setInstruction,
    setPresets,
    presets,
    presetName,
    setPresetName,
  } = props;
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleAddPreset = () => {
    if (presetName === '' || instruction === '') {
      setSnackbarOpen(true);
    } else {
      const newPreset = { name: presetName, description: instruction };
      setPresets([...presets, newPreset]);
      onClose();
    }
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ): void => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={onClose}
      // aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Lägg till en preset</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Här kan du lägga till en preset till när du ska skicka ett mail.
        </DialogContentText>
      </DialogContent>
      <Container>
        <TextField
          label="Skriv namn på din preset här."
          fullWidth
          sx={{ mb: 3, mt: 3 }}
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
        />
        <TextField
          label="Skriv din preset här."
          fullWidth
          multiline
          rows={7}
          // sx={{ mb: 3 }}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Vänligen fyll i alla fält."
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="primary" size="small" onClick={handleSnackbarClose}>
            STÄNG
          </Button>
        }
      />
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onClose}>
          Avbryt
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddPreset}>
          Lägg till
        </Button>
      </DialogActions>
    </Dialog>
  );
}
