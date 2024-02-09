import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';

import { usePostCreateAPIKeys } from 'src/api/organization';

import { IOrganization } from 'src/types/organization';

interface CreateOrgDialogProps {
  open: boolean;
  handleClose: () => void;
  organization: IOrganization[];
}

export default function CreateSystemAPIKeyDialog({
  open,
  handleClose,
  organization,
}: CreateOrgDialogProps) {
  const [organizations, setOrganizations] = useState<string>('');
  const [systemKey, setSystemKey] = useState(true);

  const { createAPIKey } = usePostCreateAPIKeys();

  const handleCreateSystemAPIKey = async () => {
    const data = {
      organization: organizations,
      systemKey,
    };

    try {
      await createAPIKey(data);
      console.log('Användare skapades.');
      resetForm();
    } catch (error) {
      console.error('Fel vid skapande av användare:', error);
    }
  };

  const handleCloseDialog = () => {
    resetForm();
    handleClose();
  };

  const resetForm = () => {
    setOrganizations('');
    setSystemKey(false);
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Skapa en System API Nyckel</DialogTitle>
      <DialogContent style={{ overflowY: 'auto' }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="org-select-label">Välj en organisation</InputLabel>
          <Select
            style={{ maxHeight: 300, overflowY: 'auto' }}
            labelId="org-select-label"
            id="org-select"
            value={organizations}
            onChange={(event) => setOrganizations(event.target.value as string)}
            input={<OutlinedInput label="Välj en organisation" />}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {organization.map((org) => (
              <MenuItem key={org._id} value={org._id} sx={{ padding: '10px 16px' }}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Avbryt</Button>
        <Button onClick={handleCreateSystemAPIKey} type="submit">
          Lägg till
        </Button>
      </DialogActions>
    </Dialog>
  );
}
