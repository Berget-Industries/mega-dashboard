import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListSubheader,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';
import {
  usePostAddUserToOrganization,
  usePostRemoveUserFromOrganization,
} from 'src/api/organization';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IUser } from 'src/types/user';
import { IOrganization, IPlugin } from 'src/types/organization';

// eslint-disable-next-line import/no-cycle
import ConfirmDialog from './confirmDialog';

// ----------------------------------------------------------------------

export interface IOrganizationTableRow {
  id: string;
  organization: {
    plugins: IPlugin[];
    id: string;
    name: string;
    logoUrl: string;
    users: string[];
  };
}

type Props = {
  row: IOrganizationTableRow;
  selected: boolean;
  users: IUser[];
};

export default function OrderTableRow({ row, selected, users }: Props) {
  const navigate = useNavigate();
  const [selectedOrg, selectOrg] = useSelectedOrgContext();
  const { organization } = row;
  const { addUser } = usePostAddUserToOrganization();
  const { removeUser } = usePostRemoveUserFromOrganization();
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const hasActivatedPlugins = organization.plugins.some((plugin) => plugin.isActivated);

  useEffect(() => {
    const userNames: string[] = organization.users
      .map((userId: string) => users.find((user: IUser) => user._id === userId))
      .filter((user: IUser | undefined): user is IUser => user !== undefined)
      .map((user: IUser) => user.name);

    setSelectedUsers(userNames);
  }, [organization, users]);

  useEffect(() => {
    // Uppdatera för att använda användar-ID
    const userIds = organization.users; // Antag att `organization.users` är en lista med användar-ID
    setSelectedUsers(userIds);
  }, [organization, users]);

  const handleUserClick = async (userId: string) => {
    const isUserSelected = selectedUsers.includes(userId);
    if (isUserSelected) {
      await removeUser(userId, organization.id);
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      await addUser(userId, organization.id);
      // Kontrollera att användar-ID inte redan finns innan du lägger till det
      if (!selectedUsers.includes(userId)) {
        setSelectedUsers((currentSelected) => [...currentSelected, userId]);
      }
    }
  };

  const handleSelectUser = (event: SelectChangeEvent<typeof selectedUsers>) => {
    const { value } = event.target;
    setSelectedUsers(typeof value === 'string' ? value.split(',') : value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDialog = () => {
    setOpen(!open);
  };

  const getUserNameById = (userId: string) => {
    const user = users.find((userr) => userr._id === userId);
    return user ? user.name : 'Okänd användare';
  };

  const renderValue = (selectedIds: string[]) => {
    if (selectedIds.length > 1) {
      // Om det finns fler än en vald, visa den första användarens namn följt av "..."
      return `${getUserNameById(selectedIds[0])}...`;
    }
    if (selectedIds.length === 1) {
      // Om endast en användare är vald, visa den användarens namn
      return getUserNameById(selectedIds[0]);
    }
    // Om ingen användare är vald, visa en uppmaning att välja användare
    return 'Välj användare';
  };

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box>{organization.id}</Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={organization.name} src={organization.logoUrl} sx={{ mr: 2 }} />

        <ListItemText
          primary={organization.name}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell>
        <FormControl fullWidth>
          <Select
            multiple
            displayEmpty
            value={selectedUsers}
            onChange={handleSelectUser}
            renderValue={() => renderValue(selectedUsers)}
            IconComponent={ArrowDropDownIcon}
            sx={{
              height: '40px',
              '.MuiSelect-select': { py: '10px', display: 'flex', alignItems: 'center' },
            }}
          >
            <ListSubheader>
              <TextField
                placeholder="Sök användare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </ListSubheader>
            {filteredUsers.map((user) => (
              <MenuItem key={user._id} value={user._id} onClick={() => handleUserClick(user._id)}>
                <Checkbox checked={selectedUsers.includes(user._id)} />
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>

      <TableCell sx={{ verticalAlign: 'middle' }}>
        <ListItemText
          primary={`${organization.plugins.reduce(
            (acc, plugin) => acc + (plugin.isActivated ? 1 : 0),
            0
          )}/${organization.plugins.length}`}
          primaryTypographyProps={{
            typography: 'body2',
            noWrap: true,
            textAlign: 'center',
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 220 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            selectOrg(organization.id);
            navigate(`/dashboard/settings`);
          }}
        >
          <Iconify icon="mdi:plug" />
          Visa plugins
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            setOpen(true);
          }}
          sx={{ color: 'error.main' }}
          disabled={!hasActivatedPlugins}
        >
          <Iconify icon="ant-design:stop-outlined" />
          Inaktivera alla plugins
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={open}
        handleClose={handleToggleDialog}
        organization={organization.name}
        organizationId={organization.id}
        plugins={organization.plugins}
      />
    </>
  );
}
