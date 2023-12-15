import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import { useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';

import { IConversation, IContact } from 'src/types/conversations';
import { useCollapseNav } from './hooks';
import ChatRoomSingle from './chat-room-single';
import ChatRoomAttachments from './chat-room-attachments';

// ----------------------------------------------------------------------

const NAV_WIDTH = 240;

type Props = {
  conversation: IConversation;
};

export default function ChatRoom({ conversation }: Props) {
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  const {
    collapseDesktop,
    onCloseDesktop,
    onCollapseDesktop,
    //
    openMobile,
    onOpenMobile,
    onCloseMobile,
  } = useCollapseNav();

  useEffect(() => {
    if (!lgUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, lgUp]);

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const actions = conversation.messages
    .map((message) => message.llmOutput.map((llmOutput) => llmOutput.actions).flat())
    .flat();

  const renderContent = (
    <>
      <ChatRoomSingle participant={conversation.contact} />
      <ChatRoomAttachments actions={actions} />
    </>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            flexShrink: 0,
            width: NAV_WIDTH,
            borderRight: `solid 1px ${theme.palette.divider}`,
            transition: theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(collapseDesktop && {
              width: 0,
            }),
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          anchor="left"
          open={openMobile}
          onClose={onCloseMobile}
          slotProps={{
            backdrop: { invisible: true },
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
