export interface IUser {
  id: number;
  nickname: string;
  email: string;
  Workspaces: IWorkspace[];
}

export interface IUserWithOnline extends IUser {
  online: boolean;
}

export interface IChannel {
  id: number;
  name: string;
  private: boolean;
  WorkspaceId: number;
}

export interface IChat {
  id: number;
  UserId: number;
  user: IUser;
  content: string;
  createdAt: Date;
  ChannelId: number;
  channel: IChannel;
}

export interface IDM {
  id: number;
  SenderId: number;
  sender: IUser;
  ReceiverId: number;
  receiver: IUser;
  content: string;
  createdAt: Date;
}

export interface IWorkspace {
  id: number;
  name: string;
  url: string;
  OwnerId: number;
}
