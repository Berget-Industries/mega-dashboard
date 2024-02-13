import React, { useEffect } from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// eslint-disable-next-line import/no-cycle
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import {
  Checkbox,
  FormControl,
  ListSubheader,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  usePostAddUserToOrganization,
  usePostRemoveUserFromOrganization,
} from 'src/api/organization';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IOrganization } from 'src/types/organization';

import ConfirmDialog from './confirmDialog';

// ----------------------------------------------------------------------

export interface IUserTableRow {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    logoUrl: string;
    organizations: string[];
  };
}

export interface IPlugin {
  _id: string;
  name: string;
  type: string;
  isActivated: boolean;
}

type Props = {
  row: IUserTableRow;
  selected: boolean;
  organization: IOrganization[];
};

export default function OrderTableRow({ row, selected, organization }: Props) {
  const { user } = row;
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedOrg, setSelectedOrg] = React.useState<string[]>([]);
  const { addUser } = usePostAddUserToOrganization();
  const { removeUser } = usePostRemoveUserFromOrganization();

  // useEffect(() => {
  //   const organizationName: string[] = user.organizations
  //     .map((organizationId: string) =>
  //       organization.find((organizations: IOrganization) => organizations._id === organizationId)
  //     )
  //     .filter(
  //       (organizations: IOrganization | undefined): organizations is IOrganization =>
  //         organization !== undefined
  //     )
  //     .map((organizations: IOrganization) => organizations.name);

  //   setSelectedOrg(organizationName);
  // }, [organization, user.organizations]);

  useEffect(() => {
    setSelectedOrg(user.organizations);
  }, [user.organizations]);

  const handleToggleDialog = () => {
    setOpen(!open);
  };

  const handleOrgClick = async (orgId: string) => {
    const isOrgSelected = selectedOrg.includes(orgId);
    if (isOrgSelected) {
      await removeUser(user.id, orgId);

      // setSelectedOrg(selectedOrg.filter((id) => id !== orgId));
    } else {
      await addUser(user.id, orgId);
      // setSelectedOrg((currentSelected) => [...currentSelected, orgId]);
    }
  };

  const filteredOrganizations = organization.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box>{user.id}</Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={user.name} src={user.logoUrl} sx={{ mr: 2 }} />

        <ListItemText
          primary={user.name}
          secondary={user.email}
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
            value={selectedOrg}
            // onChange={handleSelectOrg}
            renderValue={() =>
              selectedOrg.length === 0
                ? 'Välj organisation'
                : organization
                    .filter((org) => selectedOrg.includes(org._id))
                    .map((org) => org.name)
                    .join(', ')
            }
            IconComponent={ArrowDropDownIcon}
            sx={{
              maxWidth: '200px',
              '.MuiSelect-select': {
                py: '10px',
                display: 'flex',
                alignItems: 'center',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  overflow: 'auto',
                },
              },
            }}
          >
            <ListSubheader>
              <TextField
                placeholder="Sök organisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{
                  '.MuiInputBase-root': {
                    height: '40px',
                    width: '100%',
                    marginTop: '4px',
                  },
                  '.MuiOutlinedInput-input': {
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                  },
                  '.MuiInputLabel-root': {
                    transform: 'translate(14px, 12px) scale(1)',
                  },
                  '.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                }}
              />
            </ListSubheader>
            {filteredOrganizations.map((org) => (
              <MenuItem key={org._id} value={org._id} onClick={() => handleOrgClick(org._id!)}>
                <Checkbox checked={selectedOrg.includes(org._id!)} />
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            setOpen(true);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Ta bort användare
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={open}
        handleClose={handleToggleDialog}
        user={user.name}
        userId={user.id}
      />
    </>
  );
}
