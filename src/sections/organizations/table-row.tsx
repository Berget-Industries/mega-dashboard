import React from 'react';
import { format } from 'date-fns';

import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from 'react-router-dom';
import { IPlugin } from 'src/types/organization';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

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
};

export default function OrderTableRow({ row, selected }: Props) {
  const navigate = useNavigate();
  const [selectedOrg, selectOrg] = useSelectedOrgContext();
  const { organization } = row;
  const [open, setOpen] = React.useState(false);
  const hasActivatedPlugins = organization.plugins.some((plugin) => plugin.isActivated);

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

      <TableCell sx={{ verticalAlign: 'middle' }}>
        <ListItemText
          primary={organization.users.length}
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
