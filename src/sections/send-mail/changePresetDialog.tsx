import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Stack, Container, TextField, DialogContent, DialogContentText } from '@mui/material';
import { usePlugin, useGetOrganizationPlugins } from 'src/api/organization';
import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

interface ChangePresetProps {
  open: boolean;
  onClose: () => void;
  instruction: string;
  setInstruction: (instruction: string) => void;
  presetName: string;
  setPresetName: (presetName: string) => void;
  onRemove: (presetName: string) => void;
  setPresets: (presets: { id: string | any; name: string; description: string }[]) => void;
  presets: { id: string; name: string; description: string }[];
  selectedPreset: { id: string; name: string; description: string } | null;
}

export default function ChangePresetDialog(props: ChangePresetProps) {
  const {
    open,
    onClose,
    instruction,
    setInstruction,
    presetName,
    setPresetName,
    onRemove,
    setPresets,
    presets,
    selectedPreset,
  } = props;

  const disabled = presets.some((preset) => preset.name.toLowerCase() === presetName.toLowerCase());

  const { updatePluginConfig } = usePlugin();
  const [selectedOrg] = useSelectedOrgContext();
  const organizationPlugins = useGetOrganizationPlugins({
    organizationId: selectedOrg?._id || '',
  });

  const handleRemovePreset = async () => {
    const chainStarterPlugin = organizationPlugins.plugins.find(
      (plugin) => plugin.name === 'chain-starter'
    );

    if (chainStarterPlugin) {
      const newPresets =
        chainStarterPlugin.config?.presets.filter(
          (preset: { name: string }) => preset.name !== presetName
        ) || [];

      const updatedConfig = {
        ...chainStarterPlugin.config,
        presets: newPresets,
      };

      await updatePluginConfig({
        pluginId: chainStarterPlugin._id,
        organizationId: selectedOrg?._id || '',
        config: updatedConfig,
      })
        .then(() => {
          setPresets(newPresets);
          onClose();
        })
        .catch((error) => {
          console.error('Det gick inte att uppdatera plugin-konfigurationen', error);
        });
    }
  };

  const handleChangePreset = async () => {
    const chainStarterPlugin = organizationPlugins.plugins.find(
      (plugin) => plugin.name === 'chain-starter'
    );

    if (chainStarterPlugin) {
      const currentPresets = chainStarterPlugin.config?.presets || [];

      // Anta att du har ett sätt att få det nuvarande valda presetets ID.
      const selectedPresetId = selectedPreset?.id;

      const updatedPresets = currentPresets.map(
        (preset: { id: string; name: string; description: string }) =>
          preset.id === selectedPresetId
            ? { ...preset, name: presetName, description: instruction }
            : preset
      );

      try {
        await updatePluginConfig({
          pluginId: chainStarterPlugin._id,
          organizationId: selectedOrg?._id || '',
          config: { ...chainStarterPlugin.config, presets: updatedPresets },
        });

        setPresets(updatedPresets);
      } catch (error) {
        console.error('Det gick inte att uppdatera plugin-konfigurationen', error);
      }
    }

    onClose();
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Ändra preset</DialogTitle>
      <DialogContent>
        <DialogContentText>Här kan du ändra din preset.</DialogContentText>
      </DialogContent>
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
          // sx={{ mb: 3}}
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
            <Button
              disabled={disabled}
              variant="contained"
              color="primary"
              onClick={handleChangePreset}
            >
              Ändra
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
