import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useGetConversation } from 'src/api/organization';
import { useSelectedOrgContext } from 'src/layouts/common/context/org-menu-context';

import { useSettingsContext } from 'src/components/settings';

import { IChatParticipant } from 'src/types/chat';

import ChatRoom from '../chat-room';
import ChatMessageList from '../chat-message-list';

// ----------------------------------------------------------------------

export default function ChatView() {
  const router = useRouter();

  const { user } = useAuthContext();

  const settings = useSettingsContext();

  const [selectedOrg] = useSelectedOrgContext();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const { conversation, conversationLoading, conversationError, conversationValidating } =
    useGetConversation({
      conversation: selectedConversationId,
      organization: selectedOrg?._id || '',
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
              ..._.llmOutput.map((llmOutput) => ({
                id: `${_._id}==${llmOutput.name}`,
                body: llmOutput.output,
                createdAt: _.createdAt,
                senderId: llmOutput.name,
                contentType: 'html',
                attachments: [],
              })),
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
              name: 'Auto-Filter',
              id: 'auto-filter',
              email: '',
              avatarUrl: '',
              phoneNumber: '',
            },
            {
              id: 'mega-assistant-alex',
              name: 'ssss',
              email: '',
              avatarUrl: '',
              phoneNumber: '',
            },
            {
              id: 'mega-assistant-eva',
              name: 'Eva',
              email: '',
              avatarUrl: '',
              phoneNumber: '',
            },
            {
              id: 'chain-starter',
              name: 'Alex-OutReach',
              email: '',
              avatarUrl: '',
              phoneNumber: '',
            },
            {
              name: 'Mail-Subjector',
              id: 'mail-subjector',
              email: '',
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
      <Stack alignItems="flex-start">
        <IconButton sx={{ mb: 2 }} onClick={() => router.back()} aria-label="Gå tillbaka">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Konversation #{selectedConversationId}
        </Typography>
      </Stack>

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
