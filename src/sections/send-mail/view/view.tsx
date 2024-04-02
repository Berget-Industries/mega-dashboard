import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Stack,
  Button,
  Select,
  MenuItem,
  Snackbar,
  Container,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  OutlinedInput,
  ListSubheader,
  SnackbarCloseReason,
} from '@mui/material';

import AddPresetDialog from '../addPresetDialog';
import ChangePresetDialog from '../changePresetDialog';

export default function SendMail() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [presetName, setPresetName] = useState<string>('');
  const [instruction, setInstruction] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [openAddPresetDialog, setOpenAddPresetDialog] = useState<boolean>(false);
  const [openChangePresetDialog, setOpenChangePresetDialog] = useState<boolean>(false);
  const [presets, setPresets] = useState<{ name: string; description: string }[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const removePreset = (presetToRemove: string) => {
    setPresets(presets.filter((preset) => preset.name !== presetToRemove));
  };

  const handleSendClick = () => {
    if (name === '' || email === '' || contactInfo === '' || instruction === '') {
      setSnackbarMessage('Vänligen fyll i alla fält.');
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage('Mail skickat!');
      console.log({
        contactName: name,
        contactEmail: email,
        contactInformation: contactInfo,
        messageInstructions: instruction,
      });
      setSnackbarOpen(true);
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

  const handleReset = () => {
    setName('');
    setEmail('');
    setContactInfo('');
    setInstruction('');
    setPresetName('');
  };

  const handleOpenAddPresetDialog = () => {
    setPresetName('');
    setInstruction('');
    setOpenAddPresetDialog(true);
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="column" justifyContent="space-between">
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Skicka Mail ✉️
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Här kan du skicka ut mail till personer.
        </Typography>
      </Stack>
      <Container maxWidth="sm">
        <TextField
          label="Namn"
          fullWidth
          sx={{ mb: 3 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="E-post"
          fullWidth
          sx={{ mb: 3 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <TextField
          label="Kontaktinformation"
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 3 }}
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
        />
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="instruction-label">Välj en preset</InputLabel>
          <Select
            labelId="instruction-label"
            value={presetName}
            onChange={(e) => {
              const newName = e.target.value;
              const selectedPresett = presets.find((preset) => preset.name === newName);
              setPresetName(newName);
              if (selectedPresett) {
                setInstruction(selectedPresett.description);
              } else {
                setInstruction('');
              }
            }}
            input={<OutlinedInput label="Välj en preset" />}
            renderValue={(selected) =>
              presets.find((preset) => preset.name === selected)?.name || ''
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  maxWidth: 300,
                },
              },
              MenuListProps: {
                subheader: (
                  <ListSubheader
                    component="div"
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                    }}
                    sx={{ mb: 2, mt: 2 }}
                  >
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      onClick={handleOpenAddPresetDialog}
                    >
                      Lägg till preset
                    </Button>
                  </ListSubheader>
                ),
              },
            }}
          >
            {presets.map((preset) => (
              <MenuItem
                key={preset.name}
                value={preset.name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '50px',
                }}
              >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {preset.name}
                </div>
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    const currentPreset = presets.find((p) => p.name === preset.name);
                    if (currentPreset) {
                      setPresetName(currentPreset.name);
                      setInstruction(currentPreset.description);
                      setSelectedPreset(currentPreset);
                    }
                    setOpenChangePresetDialog(true);
                  }}
                >
                  <SettingsIcon fontSize="medium" />
                </IconButton>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={handleReset}>
            Rensa
          </Button>
          <Button variant="contained" color="primary" onClick={handleSendClick}>
            Skicka
          </Button>
        </Stack>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="primary" size="small" onClick={handleSnackbarClose}>
            STÄNG
          </Button>
        }
      />
      <AddPresetDialog
        open={openAddPresetDialog}
        onClose={() => {
          setOpenAddPresetDialog(false);
        }}
        instruction={instruction}
        setInstruction={setInstruction}
        presetName={presetName}
        setPresetName={setPresetName}
        setPresets={setPresets}
        presets={presets}
      />
      <ChangePresetDialog
        open={openChangePresetDialog}
        onClose={() => {
          setOpenChangePresetDialog(false);
        }}
        instruction={instruction}
        setInstruction={setInstruction}
        presetName={presetName}
        setPresetName={setPresetName}
        onRemove={removePreset}
        setPresets={setPresets}
        presets={presets}
      />
    </Container>
  );
}
