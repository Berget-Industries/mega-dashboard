import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { poster, fetcher, endpoints } from 'src/utils/axios';

import { IMessage } from 'src/types/message';
// eslint-disable-next-line import/no-cycle
import { IOrganization } from 'src/types/organization';
import { IConversation } from 'src/types/conversations';
import { IPlugin } from 'src/sections/organizations/table-row';

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

export function useGetOrganizations({ organization }: { organization?: string }) {
  const URL = `${endpoints.admin.organizationList}${
    organization ? `?organization=${organization}` : ''
  }`;
  console.log('Request URL:', URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      organizations: data?.organizations || [],
      organizationsLoading: isLoading,
      organizationsError: error,
      organizationsValidating: isValidating,
    }),
    [data, isLoading, error, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function usePostOrganizations() {
  const createOrganization = useCallback(async (organizationData: IOrganization) => {
    const response = await poster(endpoints.admin.organizationCreate, organizationData);
    console.log('Organisationen skapades:', response);

    await mutate(endpoints.admin.organizationList);

    return response;
  }, []);

  return { createOrganization };
}

export function usePostDeactivatePlugins() {
  const deactivatePlugins = useCallback(async (organizationId: string, plugins: IPlugin[]) => {
    const deactivatePromises = plugins.map((plugin) =>
      poster(endpoints.admin.deactivatePlugins, {
        organizationId,
        name: plugin.name,
      })
    );

    const responses = await Promise.all(deactivatePromises);

    await mutate(endpoints.admin.organizationList);

    return responses;
  }, []);

  return { deactivatePlugins };
}
