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
import LoadingButton from '@mui/lab/LoadingButton';
import { usePostUsers } from 'src/api/user';
import { useGetOrganizations } from 'src/api/organization';
import { IOrganization } from 'src/types/organization';
import { id } from 'date-fns/locale';
import { CustomDropdown } from 'src/components/custom-dropdown/index';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<IOrganization[]>([]);

  const handleCloseDialog = () => {
    setOrganizations([]);
    setUsername('');
    setLogoUrl('');
    handleClose();
  };

  const { createUser } = usePostUsers();

  const handleCreateUser = async () => {
    const userData = {
      _id: '',
      name: userName,
      email,
      avatarUrl: logoUrl || '',
      organizations: selectedOrg.map((org) => org._id),
    };

    console.log('Dina orginastioner som du vill skicka', organizations);

    if (!userName.trim()) {
      alert('Användarens namn får inte vara tomt.');
      return;
    }

    try {
      setIsLoading(true);
      await createUser(userData);
      console.log('Användare skapades.');

      setOrganizations([]);
      setUsername('');
      setLogoUrl('');
      setEmail('');
    } catch (error) {
      console.error('Fel vid skapande av organisation:', error);
    } finally {
      setIsLoading(false);
      handleCloseDialog();
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
        <CustomDropdown
          value={selectedOrg.map((org) => org._id)}
          items={(organization as IOrganization[]).map((org) => ({
            value: org._id,
            label: org.name,
          }))}
          label="Tilldela organisationer"
          onChange={(value) => {
            setSelectedOrg(
              (organization as IOrganization[]).filter((org) => value.includes(org._id))
            );
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleCloseDialog}>
          Avbryt
        </Button>
        <LoadingButton
          loading={isLoading}
          onClick={handleCreateUser}
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
