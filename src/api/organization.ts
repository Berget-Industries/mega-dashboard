import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { poster, fetcher, endpoints } from 'src/utils/axios';

import { IMessage } from 'src/types/message';
// eslint-disable-next-line import/no-cycle
import { IOrganization, IPlugin } from 'src/types/organization';
import { IConversation } from 'src/types/conversations';
import { IAPIKeys, IAPIKeysCreate, IAPIKeysRemove } from 'src/types/APIKeys';
import { IUser } from 'src/types/user';

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

export function useGetOrganizationPlugins({ organizationId }: { organizationId?: string }) {
  const URL = `${endpoints.admin.plugin.list}${
    organizationId ? `?organizationId=${organizationId}` : ''
  }`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      plugins: (data?.plugins as IPlugin[]) || [],
      pluginsLoading: isLoading,
      pluginsError: error,
      pluginsValidating: isValidating,
    }),
    [data, isLoading, error, isValidating]
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

export function usePlugin() {
  const mutationKey = (organizationId: string) =>
    `${endpoints.admin.plugin.list}${organizationId ? `?organizationId=${organizationId}` : ''}`;

  const activatePlugin = useCallback(
    async ({ pluginId, organizationId }: { pluginId: string; organizationId: string }) => {
      const response = await poster(endpoints.admin.plugin.activate, {
        pluginId,
      });

      await mutate(mutationKey(organizationId));

      return response;
    },
    []
  );

  const deactivatePlugin = useCallback(
    async ({ pluginId, organizationId }: { pluginId: string; organizationId: string }) => {
      const response = await poster(endpoints.admin.plugin.deactivate, {
        pluginId,
      });

      await mutate(mutationKey(organizationId));

      return response;
    },
    []
  );

  const updatePluginConfig = useCallback(
    async ({
      pluginId,
      organizationId,
      config,
    }: {
      pluginId: string;
      organizationId: string;
      config: Record<string, any>;
    }) => {
      const response = await poster(endpoints.admin.plugin.update, {
        pluginId,
        config,
      });

      await mutate(mutationKey(organizationId));

      return response;
    },
    []
  );

  const getAvailablePlugins = useCallback(
    async ({ organizationId }: { organizationId: string }) => {
      const response = await fetcher(
        `${endpoints.admin.plugin.available}?organizationId=${organizationId}`
      );
      return response;
    },
    []
  );

  const createNewPlugin = useCallback(
    async ({
      organizationId,
      name,
      config,
    }: {
      organizationId: string;
      name: string;
      config: Record<string, any>;
    }) => {
      const response = await poster(endpoints.admin.plugin.add, {
        organizationId,
        name,
        config,
      });

      await mutate(mutationKey(organizationId));

      return response;
    },
    []
  );

  const removePlugin = useCallback(
    async ({ pluginId, organizationId }: { pluginId: string; organizationId: string }) => {
      const response = await poster(endpoints.admin.plugin.remove, {
        pluginId,
      });

      await mutate(mutationKey(organizationId));

      return response;
    },
    []
  );

  return {
    activatePlugin,
    deactivatePlugin,
    updatePluginConfig,
    getAvailablePlugins,
    createNewPlugin,
    removePlugin,
  };
}

export function useGetAPIKeys({ apiKeys }: { apiKeys?: string }) {
  const URL = `${endpoints.admin.apiKeyList}`;
  console.log('Request URL:', URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      apiKeys: data?.apiKeys || [],
      apiKeysLoading: isLoading,
      apiKeysError: error,
      apiKeysValidating: isValidating,
    }),
    [data, isLoading, error, isValidating]
  );

  return memoizedValue;
}

export function usePostRemoveAPIKeys() {
  const removeAPIKey = useCallback(async (apiKey: IAPIKeysRemove) => {
    const response = await poster(endpoints.admin.apiKeyRemove, {
      apiKeyId: apiKey.apiKeyId,
    });
    console.log('API Nyckel togs bort:', response);

    await mutate(endpoints.admin.apiKeyList);

    return response;
  }, []);

  return { removeAPIKey };
}

export function usePostCreateAPIKeys() {
  const createAPIKey = useCallback(async (apiKey: IAPIKeysCreate) => {
    const response = await poster(endpoints.admin.apiKeyCreate, apiKey);
    console.log('API Nyckel skapades:', response);

    await mutate(endpoints.admin.apiKeyList);

    return response;
  }, []);

  return { createAPIKey };
}

export function usePostAddUserToOrganization() {
  const addUser = useCallback(async (userId: string, organizationId: string) => {
    const response = await poster(endpoints.admin.addUserToOrganization, {
      userId,
      organizationId,
    });

    await mutate(endpoints.admin.organizationList);
    await mutate(endpoints.admin.userList);

    return response;
  }, []);

  return { addUser };
}

export function usePostRemoveUserFromOrganization() {
  const removeUser = useCallback(async (userId: string, organizationId: string) => {
    const response = await poster(endpoints.admin.removeUserFromOrganization, {
      userId,
      organizationId,
    });

    await mutate(endpoints.admin.organizationList);
    await mutate(endpoints.admin.userList);

    return response;
  }, []);

  return { removeUser };
}
