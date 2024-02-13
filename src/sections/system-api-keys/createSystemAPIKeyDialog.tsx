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
import LoadingButton from '@mui/lab/LoadingButton';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { createAPIKey } = usePostCreateAPIKeys();

  const handleCreateSystemAPIKey = async () => {
    const data = {
      organization: organizations,
      systemKey: true,
    };

    try {
      setIsLoading(true);
      await createAPIKey(data);
    } catch (error) {
      console.error('Fel vid skapande av användare:', error);
    } finally {
      setIsLoading(false);
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    resetForm();
    handleClose();
  };

  const resetForm = () => {
    setOrganizations('');
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
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleCloseDialog}>
          Avbryt
        </Button>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          color="primary"
          onClick={handleCreateSystemAPIKey}
          type="submit"
        >
          Lägg till
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
