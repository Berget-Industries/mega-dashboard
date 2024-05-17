import { useState, useEffect, useRef } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';

import { useGetUsers } from 'src/api/user';
import { usePostOrganizations, useImportOrganizationData } from 'src/api/organization';

import { CustomDropdown } from 'src/components/custom-dropdown';

import { IUser } from 'src/types/user';

interface CreateOrgDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function CreateOrgDialog({ open, handleClose }: CreateOrgDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createOrganization } = usePostOrganizations();
  const { importOrganizationData } = useImportOrganizationData();
  const { users, usersLoading, usersError } = useGetUsers({});
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [organizationName, setOrganizationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        try {
          const jsonData = JSON.parse(text as string);
          await importOrganizationData(jsonData);
          console.log('Filen har importerats!');
          handleClose();
        } catch (error) {
          console.error('Ett fel inträffade vid import av filen:', error);
        }
      };
      reader.readAsText(file);
    } else {
      console.error('Vänligen välj en JSON-fil.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleCloseDialog = () => {
    setSelectedUsers([]);
    setOrganizationName('');
    setLogoUrl('');
    handleClose();
  };

  const handleCreateOrganization = async () => {
    const organizationData = {
      _id: '',
      name: organizationName,
      logoUrl: logoUrl || '',
      users: selectedUsers.map((user) => user._id),
    };

    if (!organizationName.trim()) {
      alert('Organisationens namn får inte vara tomt.');
      return;
    }

    try {
      await createOrganization(organizationData);
      console.log('Organisationen skapades.');

      handleCloseDialog();
    } catch (error) {
      console.error('Fel vid skapande av organisation:', error);
    } finally {
      setIsLoading(false);
      handleCloseDialog();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lägg till organisation</DialogTitle>
      <DialogContent style={{ overflowY: 'auto' }}>
        <TextField
          id={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          autoFocus
          required
          margin="normal"
          label="Organisationens namn"
          fullWidth
          variant="outlined"
        />
        <TextField
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          margin="normal"
          label="Logo URL"
          fullWidth
          variant="outlined"
        />
        <CustomDropdown
          value={selectedUsers.map((user) => user._id)}
          items={(users as IUser[]).map((user) => ({
            value: user._id,
            label: user.name,
          }))}
          label="Tilldela användare"
          onChange={(value) => {
            setSelectedUsers((users as IUser[]).filter((user) => value.includes(user._id)));
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleCloseDialog}>
          Avbryt
        </Button>
        <Stack flexDirection="row" gap={2}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleFileSelect}
          />
          <Button variant="outlined" onClick={handleImportClick}>
            Importera
          </Button>
          <LoadingButton
            loading={isLoading}
            onClick={handleCreateOrganization}
            type="submit"
            variant="contained"
            color="primary"
          >
            Lägg till
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
