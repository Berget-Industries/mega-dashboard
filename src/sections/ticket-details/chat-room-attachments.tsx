import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import { format } from 'date-fns';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FileThumbnail from 'src/components/file-thumbnail';

import { IAction } from 'src/types/message';
import { ListItem } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  actions: IAction[];
};

export default function ChatRoomAttachments({ actions }: Props) {
  const collapse = useBoolean(true);

  const totalAttachments = actions.length;

  const renderBtn = (
    <ListItemButton
      disabled={!actions.length}
      onClick={collapse.onToggle}
      sx={{
        pl: 2.5,
        pr: 1.5,
        height: 40,
        flexShrink: 0,
        flexGrow: 'unset',
        typography: 'overline',
        color: 'text.secondary',
        bgcolor: 'background.neutral',
      }}
    >
      <Iconify
        width={16}
        icon={
          (!collapse.value && 'eva:arrow-ios-forward-fill') ||
          (!actions.length && 'eva:arrow-ios-forward-fill') ||
          'eva:arrow-ios-downward-fill'
        }
      />
    </ListItemButton>
  );

  const renderContent = (
    <Scrollbar sx={{ px: 0, py: 1 }}>
      {actions.map((action, index) => (
        <Stack
          key={action.type + index}
          spacing={0}
          direction="row"
          alignItems="center"
          sx={{ mb: 0 }}
        >
          <ListItemButton>
            <ListItemText
              primary={
                <span>
                  {(action.type === 'skapa-reservation' && 'Ny Bokning') ||
                    (action.type === 'redigera-reservation' && 'Ändra Bokning') ||
                    (action.type === 'avboka-reservation' && 'Avbokning') ||
                    (action.type === 'fråga' && 'Fråga') ||
                    (action.type === 'manuell' && 'Manuell') ||
                    'default'}
                </span>
              }
              secondary={format(new Date(action.date), 'yyyy-MM-dd HH:mm')}
              primaryTypographyProps={{
                noWrap: true,
                typography: 'body2',
              }}
              secondaryTypographyProps={{
                mt: 0.25,
                noWrap: true,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />
          </ListItemButton>
        </Stack>
      ))}
    </Scrollbar>
  );

  return (
    <>
      <Box
        component="span"
        sx={{
          p: 1,
          pl: 2.5,
          pr: 1.5,
          flexShrink: 0,
          flexGrow: 'unset',
          typography: 'overline',
          color: 'text.secondary',
          bgcolor: 'background.neutral',
        }}
      >
        Händelser ({totalAttachments})
      </Box>
      {renderContent}
    </>
  );
}
