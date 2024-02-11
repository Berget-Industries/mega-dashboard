import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  console.log('Fetching data from URL:', url);
  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const poster = async <T>(url: string, data: object): Promise<T> => {
  console.log('Posting data to URL:', url);
  try {
    const res = await axiosInstance.post<T>(url, data);
    console.log('Post successful:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error as AxiosError;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  organization: {
    get: '/api/dashboard/get',
    conversations: '/api/dashboard/conversations',
    conversation: '/api/dashboard/conversation',
    messages: '/api/dashboard/messages',
  },
  admin: {
    organizationList: '/api/admin/organization/list',
    organizationCreate: '/api/admin/organization/create',
    organizationRemove: '/api/admin/organization/remove',
    deactivatePlugins: '/api/admin/plugin/deactivate',
    userList: '/api/admin/user/list',
    userCreate: '/api/admin/user/create',
    userRemove: '/api/admin/user/remove',
    apiKeyList: '/api/admin/apikey/list',
    apiKeyCreate: '/api/admin/apikey/create',
    apiKeyRemove: '/api/admin/apikey/remove',
    plugin: {
      add: '/api/admin/plugin/add',
      list: '/api/admin/plugin/list',
      remove: '/api/admin/plugin/remove',
      update: '/api/admin/plugin/update',
      activate: '/api/admin/plugin/activate',
      deactivate: '/api/admin/plugin/deactivate',
      available: '/api/admin/plugin/get-available-plugins',
    },
  },
};
