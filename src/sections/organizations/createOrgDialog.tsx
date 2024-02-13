import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { usePostOrganizations } from 'src/api/organization';
import { useGetUsers } from 'src/api/user';
import { CustomDropdown } from 'src/components/custom-dropdown';
import { IUser } from 'src/types/user';

interface CreateOrgDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function CreateOrgDialog({ open, handleClose }: CreateOrgDialogProps) {
  const { createOrganization } = usePostOrganizations();
  const { users, usersLoading, usersError } = useGetUsers({});

  const [logoUrl, setLogoUrl] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [organizationName, setOrganizationName] = useState<string>('');

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
          label="Tilldela anvnändare"
          onChange={(value) => {
            setSelectedUsers((users as IUser[]).filter((user) => value.includes(user._id)));
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Avbryt</Button>
        <Button onClick={handleCreateOrganization} type="submit">
          Lägg till
        </Button>
      </DialogActions>
    </Dialog>
  );
}
