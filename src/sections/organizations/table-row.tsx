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
  Stack,
} from '@mui/material';

import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';
import {
  usePostAddUserToOrganization,
  usePostRemoveUserFromOrganization,
} from 'src/api/organization';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { CustomDropdown } from 'src/components/custom-dropdown/index';
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
  const [loadingDropDownItems, setLoadingDropDownItems] = React.useState<string[]>([]);

  useEffect(() => {
    const userIds = organization.users;
    setSelectedUsers(userIds);
  }, [organization, users]);

  const handleToggleDialog = () => {
    setOpen(!open);
  };

  const onUsersChange = async (value: string[], item: string) => {
    setLoadingDropDownItems([...loadingDropDownItems, item]);
    if (selectedUsers.includes(item)) {
      await removeUser(item, organization.id);
    } else {
      await addUser(item, organization.id);
    }
    setLoadingDropDownItems(loadingDropDownItems.filter((_) => _ !== item));
  };

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box>{organization.id}</Box>
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center">
          <Avatar alt={organization.name} src={organization.logoUrl} sx={{ mr: 2 }} />

          <ListItemText
            primary={organization.name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </Stack>
      </TableCell>
      <TableCell sx={{ width: '13%' }}>
        <CustomDropdown
          items={users.map((user) => ({
            value: user._id,
            label: user.name,
            isLoading: loadingDropDownItems.includes(user._id),
          }))}
          onChange={onUsersChange}
          label="Välj användare"
          value={selectedUsers}
          dense
        />
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
