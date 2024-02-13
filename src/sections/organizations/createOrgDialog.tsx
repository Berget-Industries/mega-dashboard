import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { usePostOrganizations } from 'src/api/organization';

interface CreateOrgDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function CreateOrgDialog(props: CreateOrgDialogProps) {
  const { open, handleClose } = props;
  const [organizationName, setOrganizationName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [users, setUsers] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setUsers(['']);
    setOrganizationName('');
    setLogoUrl('');
    handleClose();
  };

  const handleAddUser = () => {
    setUsers([...users, '']);
  };

  const handleRemoveUser = (index: number) => {
    setUsers(users.filter((_, idx) => idx !== index));
  };

  const { createOrganization } = usePostOrganizations();

  const handleCreateOrganization = async () => {
    try {
      setIsLoading(true);
      const organizationData = {
        _id: '',
        name: organizationName,
        logoUrl: logoUrl || '',
        users,
      };

      if (!organizationName.trim()) {
        alert('Organisationens namn får inte vara tomt.');
        return;
      }

      const nonEmptyUsers = users.filter((user) => user.trim() !== '');
      if (nonEmptyUsers.length === 0) {
        alert('Minst en användare måste anges.');
        return;
      }

      await createOrganization(organizationData);
      console.log('Organisationen skapades.');

      setUsers(['']);
      setOrganizationName('');
      setLogoUrl('');
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
          value={organizationName}
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
        {users.map((user, index) => (
          <div key={index}>
            <TextField
              value={user}
              onChange={(e) => {
                const newUsers = [...users];
                newUsers[index] = e.target.value;
                setUsers(newUsers);
              }}
              required
              margin="normal"
              label={`Användare ${index + 1}`}
              fullWidth
              variant="outlined"
            />
            {users.length > 1 && (
              <Button onClick={() => handleRemoveUser(index)}>Ta bort användare</Button>
            )}
          </div>
        ))}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleCloseDialog}>
          Avbryt
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
      </DialogActions>
    </Dialog>
  );
}
