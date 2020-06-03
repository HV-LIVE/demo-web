import { request } from 'umi';

export interface SystemConfig {
  pushIp: string,
  pushPort: number,
  pullIp: string,
  pullPort: number,
  createTime: string,
  updateTime: string,
}

export interface User {
  id: number,
  account: string,
  password: string,
  name: string,
  phoneNumber: string,
  streamName: string,
  createTime: string,
  updateTime: string,
}

export interface Section {
  id: number,
  name: string,
  channelId: number,
  createTime: string,
  updateTime: string,
}

export interface Channel {
  id: number,
  name: string,
  sections: Section[],
  createTime: string,
  updateTime: string,
}

export interface Live {
  id: number,
  title: string,
  channelId: number,
  channel: Channel,
  sectionId: number,
  section: Section,
  userId: number,
  user: User,
  startTime: string,
  endTime: string,
  createTime: string,
  updateTime: string,
}

export default {
  getSystemConfig: async (): Promise<SystemConfig> => {
    return await request('/systemConfig', { method: 'GET' });
  },
  updateSystemConfig: async (data: SystemConfig): Promise<SystemConfig> => {
    return await request('/systemConfig', { method: 'PUT', data });
  },
  getAllUsers: async (): Promise<User[]> => {
    return await request('/users', { method: 'GET' });
  },
  createUser: async (data: User): Promise<User> => {
    return await request('/users', { method: 'POST', data });
  },
  deleteUser: async (id: number): Promise<void> => {
    return await request(`/users/${id}`, { method: 'DELETE' });
  },
  login: async (account: string, password: string): Promise<User> => {
    return await request('/users/auth', { method: 'GET', params: { account, password } });
  },
  getUser: async (id: number): Promise<User> => {
    return await request(`/users/${id}`, { method: 'GET' });
  },
  getAllChannelsAndSections: async (): Promise<Channel[]> => {
    return await request('/channels', { method: 'GET' });
  },
  getAvailableChannels: async (): Promise<Channel[]> => {
    return await request('/channels/available', { method: 'GET' });
  },
  createChannel: async (data: Channel): Promise<Channel> => {
    return await request('/channels', { method: 'POST', data });
  },
  deleteChannel: async (id: number): Promise<void> => {
    return await request(`/channels/${id}`, { method: 'DELETE' });
  },
  createSection: async (data: Section): Promise<Section> => {
    return await request('/sections', { method: 'POST', data });
  },
  deleteSection: async (id: number): Promise<void> => {
    return await request(`/sections/${id}`, { method: 'DELETE' });
  },
  getAllLives: async (): Promise<Live[]> => {
    return await request('/lives', { method: 'GET' });
  },
  getUserLives: async (userId: number): Promise<Live[]> => {
    return await request('/lives', { method: 'GET', params: { userId } });
  },
  getAvailableLives: async (): Promise<Live[]> => {
    return await request('/lives/available', { method: 'GET' });
  },
  createLive: async (data: Live): Promise<Live> => {
    return await request('/lives', { method: 'POST', data });
  },
  deleteLive: async (id: number): Promise<void> => {
    return await request(`/lives/${id}`, { method: 'DELETE' });
  },
};
