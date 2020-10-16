import { ChatWrapper } from '@components/Chat/styles';
import { IChat, IDM, IUser } from '@typings/db';
import dayjs from 'dayjs';
import gravatar from 'gravatar';
import React, { FC } from 'react';

interface Props {
  data: IDM | IChat;
}

const Chat: FC<Props> = ({ data }) => {
  const user: IUser = 'Sender' in data ? data.Sender : data.User;
  return (
    <ChatWrapper>
      <div>
        <img src={gravatar.url(user.email, { s: '36px' })} alt={user.nickname} />
      </div>
      <div style={{ flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flex: '0 0 100%', alignItems: 'center' }}>
          <b style={{ marginRight: 5 }}>{user.nickname}</b>
          <span style={{ fontSize: 12 }}>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p style={{ flex: '0 0 100%', margin: 0 }}>{data.content}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
