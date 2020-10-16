export interface IUser {
  id: number;
  nickname: string;
  email: string;
}

export interface IUserWithOnline extends IUser {
  online: boolean;
}

export interface IChat {
  id: number;
  UserId: number;
  User: IUser;
  content: string;
  createdAt: Date;
}

export interface IDM {
  id: number;
  SenderId: number;
  Sender: IUser;
  ReceiverId: number;
  Receiver: IUser;
  content: string;
  createdAt: Date;
}
