import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';

import { IChatParticipant } from 'src/types/chat';
import { IConversation, IContact } from 'src/types/conversations';

// ----------------------------------------------------------------------

type Props = {
  participant: IContact;
};

export default function ChatRoomSingle({ participant }: Props) {
  const collapse = useBoolean(true);

  const { name, avatarUrl, phoneNumber, email } = participant;

  const renderInfo = (
    <Stack alignItems="center" sx={{ py: 5 }}>
      <Avatar alt={name} src={avatarUrl} sx={{ width: 96, height: 96, mb: 2 }} />
      <Typography variant="subtitle1">{name}</Typography>

      <Stack
        spacing={0}
        sx={{
          px: 2,
          py: 1,
          '& svg': {
            mr: 1,
            flexShrink: 0,
            color: 'text.disabled',
          },
        }}
      >
        {phoneNumber && (
          <Stack direction="row">
            <Iconify icon="solar:phone-bold" />
            <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
              {phoneNumber}
            </Typography>
          </Stack>
        )}
        {email && (
          <Stack direction="row">
            <Iconify icon="fluent:mail-24-filled" />
            <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
              {email}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );

  return <>{renderInfo}</>;
}
