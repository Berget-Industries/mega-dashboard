import { format } from 'date-fns';
import React, { useEffect } from 'react';

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
  Stack,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  usePostAddUserToOrganization,
  usePostRemoveUserFromOrganization,
} from 'src/api/organization';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { CustomDropdown } from 'src/components/custom-dropdown/index';
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
  const [selectedOrg, setSelectedOrg] = React.useState<string[]>([]);
  const { addUser } = usePostAddUserToOrganization();
  const { removeUser } = usePostRemoveUserFromOrganization();
  const [loadingDropDownItems, setLoadingDropDownItems] = React.useState<string[]>([]);

  useEffect(() => {
    setSelectedOrg(user.organizations);
  }, [user.organizations]);

  const handleToggleDialog = () => {
    setOpen(!open);
  };

  const onOrganizationChange = async (value: string[], item: string) => {
    setLoadingDropDownItems([...loadingDropDownItems, item]);
    if (selectedOrg.includes(item)) {
      await removeUser(user.id, item);
    } else {
      await addUser(user.id, item);
    }
    setLoadingDropDownItems(loadingDropDownItems.filter((_) => _ !== item));
  };

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box>{user.id}</Box>
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center">
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
        </Stack>
      </TableCell>

      <TableCell sx={{ width: '13%', maxWidth: '13%' }}>
        <CustomDropdown
          items={organization.map((org) => ({
            value: org._id,
            label: org.name,
            isLoading: loadingDropDownItems.includes(org._id),
          }))}
          onChange={onOrganizationChange}
          label="Välj organisation"
          value={selectedOrg}
          dense
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
