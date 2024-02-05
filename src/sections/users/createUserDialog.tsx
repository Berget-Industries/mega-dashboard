import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { usePostUsers } from 'src/api/user';

interface CreateOrgDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function CreateOrgDialog(props: CreateOrgDialogProps) {
  const { open, handleClose } = props;
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [organizations, setOrganizations] = useState<string[]>(['']);

  const handleCloseDialog = () => {
    setOrganizations(['']);
    setUsername('');
    setLogoUrl('');
    handleClose();
  };

  const handleAddUser = () => {
    setOrganizations([...organizations, '']);
  };

  const handleRemoveUser = (index: number) => {
    setOrganizations(organizations.filter((_, idx) => idx !== index));
  };

  const { createUser } = usePostUsers();

  const handleCreateOrganization = async () => {
    const userData = {
      name: userName,
      email,
      avatarUrl: logoUrl || '',
      organizations,
    };

    if (!userName.trim()) {
      alert('Användarens namn får inte vara tomt.');
      return;
    }

    const nonEmptyUsers = organizations.filter((organization) => organization.trim() !== '');
    if (nonEmptyUsers.length === 0) {
      alert('Minst en användare måste anges.');
      return;
    }

    try {
      await createUser(userData);
      console.log('Organisationen skapades.');

      setOrganizations(['']);
      setUsername('');
      setLogoUrl('');
    } catch (error) {
      console.error('Fel vid skapande av organisation:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lägg till organisation</DialogTitle>
      <DialogContent style={{ overflowY: 'auto' }}>
        <TextField
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
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
        {organizations.map((organization, index) => (
          <div key={index}>
            <TextField
              value={organization}
              onChange={(e) => {
                const newOrganization = [...organizations];
                newOrganization[index] = e.target.value;
                setOrganizations(newOrganization);
              }}
              required
              margin="normal"
              label={`Användare ${index + 1}`}
              fullWidth
              variant="outlined"
            />
            {organization.length > 1 && (
              <Button onClick={() => handleRemoveUser(index)}>Ta bort användare</Button>
            )}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddUser}>+ Lägg till användare</Button>
        <Button onClick={handleCloseDialog}>Avbryt</Button>
        <Button onClick={handleCreateOrganization} type="submit">
          Lägg till
        </Button>
      </DialogActions>
    </Dialog>
  );
}
