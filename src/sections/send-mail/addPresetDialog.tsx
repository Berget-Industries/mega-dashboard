import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import { Container, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContentText from '@mui/material/DialogContentText';

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddPreset = () => {
    const newPreset = { name: presetName, description: instruction };
    setPresets([...presets, newPreset]);
    onClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      sx={{ '& .MuiDialog-paper': { width: '30vw', maxHeight: 435 } }}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Lägg till en preset.</DialogTitle>
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
          rows={4}
          sx={{ mb: 3, mt: 3 }}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
      </Container>
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
