import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Container, TextField, Snackbar, SnackbarCloseReason } from '@mui/material';

import { usePlugin, useGetOrganizationPlugins } from 'src/api/organization';
import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

interface AddPresetProps {
  open: boolean;
  onClose: () => void;
  instruction: string;
  setInstruction: (instruction: string) => void;
  setPresets: (presets: { id: string | any; name: string; description: string }[]) => void;
  presets: { id: string; name: string; description: string }[];
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
  const [selectedOrg] = useSelectedOrgContext();
  const disabled =
    presetName === '' ||
    instruction === '' ||
    presets.some((preset) => preset.name.toLowerCase() === presetName.toLowerCase());
  const { updatePluginConfig } = usePlugin();
  const organizationPlugins = useGetOrganizationPlugins({
    organizationId: selectedOrg?._id || '',
  });

  const handleAddPreset = async () => {
    if (presetName === '' || instruction === '') {
      setSnackbarOpen(true);
    } else {
      const newPreset = { id: uuidv4(), name: presetName, description: instruction };
      setPresets([...presets, newPreset]);
      console.log(newPreset);

      const chainStarterPlugin = organizationPlugins.plugins.find(
        (plugin) => plugin.name === 'chain-starter'
      );

      if (chainStarterPlugin) {
        const currentPresets = chainStarterPlugin.config?.presets || [];

        const updatedConfig = {
          ...chainStarterPlugin.config,
          presets: [...currentPresets, newPreset],
        };

        await updatePluginConfig({
          pluginId: chainStarterPlugin._id,
          organizationId: selectedOrg?._id || '',
          config: updatedConfig,
        });
      }

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
        <Button disabled={disabled} variant="contained" color="primary" onClick={handleAddPreset}>
          Lägg till
        </Button>
      </DialogActions>
    </Dialog>
  );
}
