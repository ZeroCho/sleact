import { ChatWrapper } from '@components/Chat/styles';
import { IChat } from '@pages/Channel';
import dayjs from 'dayjs';
import gravatar from 'gravatar';
import React, { FC } from 'react';

interface Props {
  data: IChat;
}

const Chat: FC<Props> = ({ data }) => {
  return (
    <ChatWrapper>
      <div>
        <img src={gravatar.url(data.User.email, { s: '36px' })} alt={data.User.nickname} />
      </div>
      <div style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 100%' }}>
          <b>{data.User.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p style={{ flex: '0 0 100%' }}>{data.content}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
