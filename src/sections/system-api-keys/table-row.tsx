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

import { useAuthContext } from 'src/auth/hooks';
import { usePostRemoveAPIKeys } from 'src/api/organization';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import ConfirmDialog from './confirmDialog';

// eslint-disable-next-line import/no-cycle
// import ConfirmDialog from './confirmDialog';

// ----------------------------------------------------------------------

export interface ISystemAPIKeysTableRow {
  id: string;
  apiKeys: {
    _id: string;
    key: string;
    organization: string;
    systemKey: boolean;
  };
}

type Props = {
  row: ISystemAPIKeysTableRow;
  selected: boolean;
};

export default function APIKeysTableRow({ row, selected }: Props) {
  const { apiKeys } = row;
  const [open, setOpen] = React.useState(false);
  const { user } = useAuthContext();
  const { removeAPIKey } = usePostRemoveAPIKeys();

  const handleToggleDialog = () => {
    setOpen(!open);
  };

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box>{apiKeys.organization}</Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={apiKeys.organization} sx={{ mr: 2 }} />

        <ListItemText
          primary={
            user?.organizations.find((org: { _id: string }) => org._id === apiKeys.organization)
              ?.name
          }
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ verticalAlign: 'middle' }}>
        <ListItemText
          primary={apiKeys.key}
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
            setOpen(true);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Ta bort nyckel
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={open}
        handleClose={handleToggleDialog}
        apiKeys={apiKeys.organization}
        apiKeysId={apiKeys.key}
      />
    </>
  );
}
