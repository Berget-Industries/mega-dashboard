import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Stack, Container, TextField } from '@mui/material';

interface CreateOrgDialogProps {
  open: boolean;
  onClose: () => void;
  instruction: string;
  setInstruction: (instruction: string) => void;
  presetName: string;
  setPresetName: (presetName: string) => void;
  onRemove: (presetName: string) => void;
  setPresets: (options: { name: string; description: string }[]) => void;
}

export default function ChangePresetDialog(props: CreateOrgDialogProps) {
  const {
    open,
    onClose,
    instruction,
    setInstruction,
    presetName,
    setPresetName,
    onRemove,
    setPresets,
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleRemovePreset = () => {
    console.log('Remove preset');
    onRemove(presetName);
    onClose();
  };

  const handleChangePreset = () => {
    const changePreset = { name: presetName, description: instruction };
    setPresets([changePreset]);
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
      <DialogTitle id="responsive-dialog-title">Ändra preset</DialogTitle>
      <Container>
        <TextField
          label="Preset namn"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          fullWidth
          sx={{ mb: 3, mt: 3 }}
        />
        <TextField
          label="Preset beskrivning."
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 3, mt: 3 }}
        />
      </Container>
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <Button variant="contained" color="error" onClick={handleRemovePreset}>
            Ta bort
          </Button>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={onClose}>
              Avbryt
            </Button>
            <Button variant="contained" color="primary" onClick={handleChangePreset}>
              Ändra
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
