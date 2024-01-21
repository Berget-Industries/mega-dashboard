import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface FormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FormDialog({ open, setOpen }: FormDialogProps) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      <DialogTitle>Ändra konfig</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Här byter du konfig till de som passar din organisation!
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="normal"
          id="name"
          label="Plugin"
          fullWidth
          variant="outlined"
        />
        <TextField required margin="normal" id="name" label="Plugin" fullWidth variant="outlined" />
        <TextField
          required
          margin="normal"
          id="outlined-multiline-static"
          label="System Prompt"
          multiline
          rows={6}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Avbryt</Button>
        <Button type="submit">Ändra</Button>
      </DialogActions>
    </Dialog>
  );
}
