import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from '@mui/material';
import { usePostUsers } from 'src/api/user';
import { useGetOrganizations } from 'src/api/organization';
import { IOrganization } from 'src/types/organization';

interface CreateOrgDialogProps {
  open: boolean;
  handleClose: () => void;
  organization: IOrganization[];
}

export default function CreateOrgDialog(props: CreateOrgDialogProps) {
  const { open, handleClose, organization } = props;
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [organizations, setOrganizations] = useState<string[]>([]);

  const handleCloseDialog = () => {
    setOrganizations([]);
    setUsername('');
    setLogoUrl('');
    handleClose();
  };

  const { createUser } = usePostUsers();

  const handleCreateUser = async () => {
    const userData = {
      name: userName,
      email,
      avatarUrl: logoUrl || '',
      organizations,
    };

    console.log('Dina orginastioner som du vill skicka', organizations);

    if (!userName.trim()) {
      alert('Användarens namn får inte vara tomt.');
      return;
    }

    try {
      await createUser(userData);
      console.log('Användare skapades.');

      setOrganizations([]);
      setUsername('');
      setLogoUrl('');
      setEmail('');
    } catch (error) {
      console.error('Fel vid skapande av organisation:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Lägg till användare</DialogTitle>
      <DialogContent style={{ overflowY: 'auto' }}>
        <TextField
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          required
          margin="normal"
          label="Användarens namn"
          fullWidth
          variant="outlined"
        />
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          label="Användarens e-post"
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
        <FormControl fullWidth margin="normal">
          <InputLabel id="org-select-label">Välj en eller flera organisationer</InputLabel>
          <Select
            style={{ maxHeight: 300, overflowY: 'auto' }}
            key={open ? 'open' : 'closed'}
            labelId="org-select-label"
            id="org-select"
            multiple
            value={organizations}
            onChange={(event) => setOrganizations(event.target.value as string[])}
            input={<OutlinedInput label="Välj en eller flera organisationer" />}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {organization.map((org) => (
              <MenuItem key={org._id} value={org._id}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Avbryt</Button>
        <Button onClick={handleCreateUser} type="submit">
          Lägg till
        </Button>
      </DialogActions>
    </Dialog>
  );
}
