import React from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import ConfirmDialog from './confirmDialog';

// ----------------------------------------------------------------------

interface IOrganizationTableRow {
  id: string;
  organization: {
    plugins: string[];
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
  const { organization } = row;
  const [open, setOpen] = React.useState(false);

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
        >
          <Iconify icon="ant-design:stop-outlined" />
          Inaktivera organisation
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={open}
        handleClose={handleToggleDialog}
        organization={organization.name}
      />
    </>
  );
}
