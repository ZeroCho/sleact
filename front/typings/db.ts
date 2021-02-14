export interface IUser {
  id: number;
  nickname: string;
  email: string;
  workspaces: IWorkspace[];
}

export interface IUserWithOnline extends IUser {
  online: boolean;
}

export interface IChannel {
  id: number;
  name: string;
  private: boolean;
  workspaceId: number;
}

export interface IChat {
  id: number;
  userId: number;
  user: IUser;
  content: string;
  createdAt: Date;
  channelId: number;
  channel: IChannel;
}

export interface IDM {
  id: number;
  senderId: number;
  sender: IUser;
  receiverId: number;
  receiver: IUser;
  content: string;
  createdAt: Date;
}

export interface IWorkspace {
  id: number;
  name: string;
  url: string;
  ownerId: number;
}
