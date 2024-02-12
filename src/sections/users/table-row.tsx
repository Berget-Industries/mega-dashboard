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

  useEffect(() => {
    const organizationName: string[] = user.organizations
      .map((organizationId: string) =>
        organization.find((organizations: IOrganization) => organizations._id === organizationId)
      )
      .filter(
        (organizations: IOrganization | undefined): organizations is IOrganization =>
          organization !== undefined
      )
      .map((organizations: IOrganization) => organizations.name);

    setSelectedOrg(organizationName);
  }, [organization, user.organizations]);

  useEffect(() => {
    setSelectedOrg(user.organizations);
  }, [user.organizations]);

  const handleToggleDialog = () => {
    setOpen(!open);
  };

  const handleSelectOrg = (event: SelectChangeEvent<typeof selectedOrg>) => {
    const { value } = event.target;
    setSelectedOrg(typeof value === 'string' ? value.split(',') : value);
  };

  const renderValue = (selectedOrgIds: string[]) => {
    const selectedOrgNames = selectedOrgIds
      .map((orgId) => {
        const org = organization.find((orgs) => orgs._id === orgId);
        return org ? org.name : null;
      })
      .filter((name) => name !== null)
      .join(', ');

    return selectedOrgNames || 'Välj organisation';
  };

  const handleOrgClick = async (orgId: string) => {
    const isOrgSelected = selectedOrg.includes(orgId);
    if (isOrgSelected) {
      await removeUser(user.id, orgId);
      setSelectedOrg(selectedOrg.filter((id) => id !== orgId));
    } else {
      await addUser(user.id, orgId);
      setSelectedOrg((currentSelected) => [...currentSelected, orgId]);
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
            onChange={handleSelectOrg}
            renderValue={() => renderValue(selectedOrg)}
            IconComponent={ArrowDropDownIcon}
            sx={{
              maxHeight: '40px',
              '.MuiSelect-select': { py: '10px', display: 'flex', alignItems: 'center' },
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
                    width: '100%', // Justera höjden här
                  },
                  '.MuiOutlinedInput-input': {
                    padding: '10px 14px', // Minska padding för att minska höjd
                    fontSize: '0.875rem', // Anpassa textstorlek om nödvändigt
                  },
                  '.MuiInputLabel-root': {
                    transform: 'translate(14px, 12px) scale(1)', // Justera label position vid behov
                  },
                  '.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)', // Justera förminskad label position
                  },
                }}
              />
            </ListSubheader>
            {filteredOrganizations.map((organizations) => (
              <MenuItem
                key={organizations._id}
                value={organizations._id}
                onClick={() => handleOrgClick(organizations._id!)}
              >
                <Checkbox checked={selectedOrg.includes(organizations._id!)} />
                {organizations.name}
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
