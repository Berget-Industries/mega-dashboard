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

// ----------------------------------------------------------------------

interface ITicketTableRow {
  id: string;
  conversationId: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
  createdAt: Date;
  type: string[];
}

type Props = {
  row: ITicketTableRow;
  selected: boolean;
  onViewRow: VoidFunction;
};

export default function OrderTableRow({ row, selected, onViewRow }: Props) {
  const { orderNumber, createdAt, customer, type } = row;

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {orderNumber}
        </Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={customer.name} src={customer.avatarUrl} sx={{ mr: 2 }} />

        <ListItemText
          primary={customer.name}
          secondary={customer.email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(createdAt), 'HH:mm')}
          secondary={format(new Date(createdAt), 'dd MMM yyyy')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        {type.map((_) => (
          <Label
            variant="soft"
            color={
              (_ === 'skapa-reservation' && 'success') ||
              (_ === 'redigera-reservation' && 'warning') ||
              (_ === 'avboka-reservation' && 'error') ||
              (_ === 'fråga' && 'info') ||
              (_ === 'manuell' && 'primary') ||
              'default'
            }
          >
            {(_ === 'skapa-reservation' && 'Ny Bokning') ||
              (_ === 'redigera-reservation' && 'Ändra Bokning') ||
              (_ === 'avboka-reservation' && 'Avbokning') ||
              (_ === 'fråga' && 'Fråga') ||
              (_ === 'manuell' && 'Manuell') ||
              'default'}
          </Label>
        ))}
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
        sx={{ width: 180 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Visa Kontakt
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Visa Konversation
        </MenuItem>
      </CustomPopover>
    </>
  );
}
