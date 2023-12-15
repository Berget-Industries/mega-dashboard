import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useGetConversation } from 'src/api/organization';

import { useSettingsContext } from 'src/components/settings';

import { IChatParticipant } from 'src/types/chat';

import { useAuthContext } from 'src/auth/hooks';
import ChatRoom from '../chat-room';
import ChatMessageList from '../chat-message-list';

// ----------------------------------------------------------------------

export default function ChatView() {
  const router = useRouter();

  const { user } = useAuthContext();

  const settings = useSettingsContext();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const { conversation, conversationLoading, conversationError, conversationValidating } =
    useGetConversation({
      conversation: selectedConversationId,
      organization: '6567688da895a324a728385d',
    });

  console.log(conversation);
  useEffect(() => {
    if (conversationError || !selectedConversationId) {
      router.push(paths.dashboard.tickets.root);
    }
  }, [conversationError, router, selectedConversationId]);

  const details = !!conversation;

  console.log(conversation.contact);

  const renderMessages = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      {!conversationLoading && (
        <ChatMessageList
          messages={conversation?.messages
            .map((_) => [
              {
                id: `${_._id}==user`,
                body: _.input,
                createdAt: _.createdAt,
                senderId: conversation.contact._id,
                contentType: 'html',
                attachments: [],
              },
              {
                id: `${_._id}==${_.llmOutput[1].name}`,
                body: _.llmOutput[1].output,
                createdAt: _.createdAt,
                senderId: _.llmOutput[1].name,
                contentType: 'html',
                attachments: [],
              },
            ])
            .flat()}
          participants={[
            {
              id: conversation.contact._id,
              name: conversation.contact.name,
              email: conversation.contact.email,
              avatarUrl: conversation.contact.avatarUrl,
              phoneNumber: conversation.contact.phoneNumber,
            },
            {
              id: 'eva',
              name: 'Eva',
              email: 'reservation@trattorian.se',
              avatarUrl: '',
              phoneNumber: '',
            },
          ]}
        />
      )}
    </Stack>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Konversation #{selectedConversationId}
      </Typography>

      <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
        <Stack
          sx={{
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
        >
          <Stack
            direction="row"
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >
            {!conversationLoading && <ChatRoom conversation={conversation} />}
            {renderMessages}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
