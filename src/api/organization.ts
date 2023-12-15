import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { IMessage } from 'src/types/message';
import { IConversation } from 'src/types/conversations';

// ----------------------------------------------------------------------

export function useGetOrganizationMessages({
  organization,
  startDate,
  endDate,
}: {
  organization: string;
  startDate: Date;
  endDate: Date;
}) {
  const URL = organization
    ? [
        endpoints.organization.messages,
        {
          params: {
            organization,
            startDate: encodeURIComponent(startDate.toISOString()),
            endDate: encodeURIComponent(endDate.toISOString()),
          },
        },
      ]
    : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      messages: (data?.messages as IMessage[]) || [],
      messagesLoading: isLoading,
      messagesError: error,
      messagesValidating: isValidating,
      messagesEmpty: !isLoading && !data?.messages.length,
    }),
    [data?.messages, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetOrganizationConversations(organization: string) {
  const URL = organization
    ? [endpoints.organization.conversations, { params: { organization } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      conversations: (data?.conversations as IConversation[]) || [],
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !data?.conversations.length,
    }),
    [data?.conversations, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversation({
  conversation,
  organization,
}: {
  conversation: string;
  organization: string;
}) {
  const URL = conversation
    ? [endpoints.organization.conversation, { params: { conversation, organization } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      conversation: (data?.conversation as IConversation) || [],
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
    }),
    [data?.conversation, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
