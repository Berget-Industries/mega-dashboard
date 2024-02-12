import React, { useEffect } from 'react';
import { format } from 'date-fns';
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
  FormControl,
  InputLabel,
  ListSubheader,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';

import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IUser } from 'src/types/user';
import { IPlugin } from 'src/types/organization';

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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelectUser = (event: any) => {
    const { value } = event.target;
    setSelectedUsers(typeof value === 'string' ? value.split(',') : value);
  };

  const handleToggleDialog = () => {
    setOpen(!open);
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
        <FormControl>
          <Select
            sx={{
              height: 32,
              '.MuiSelect-select': {
                py: '6px',
                fontSize: '0.875rem',
              },
              '.MuiSvgIcon-root': {
                fontSize: '1rem',
              },
            }}
            labelId="user-select-label"
            multiple
            displayEmpty
            value={selectedUsers}
            onChange={handleSelectUser}
            renderValue={(selectedd) =>
              selectedd.length > 0 ? selectedd.join(', ') : 'Inga användare'
            }
            IconComponent={ArrowDropDownIcon}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            <ListSubheader>
              <TextField
                placeholder="Sök användare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{
                  '.MuiInputBase-root': {
                    height: '40px',
                    width: '100%',
                  },
                }}
              />
            </ListSubheader>
            {filteredUsers.map((user) => (
              <MenuItem key={user._id} value={user.name}>
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
