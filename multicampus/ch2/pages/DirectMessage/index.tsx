import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { Header } from '@pages/DirectMessage/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router-dom';
import React, { useCallback } from 'react';
import gravatar from 'gravatar';
import useSWR, { useSWRInfinite } from 'swr';
import axios from 'axios';
import { IDM } from '../../../front/typings/db';

const PAGE_SIZE = 20;
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR<IUser>('/api/user', fetcher);
  const { data: userData } = useSWR<IUser>(`/api/workspace/${workspace}/user/${id}`, fetcher);
  const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspace/${workspace}/dm/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (myData && userData && chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }).then(() => {
          setChat('');
        });
        axios
          .post(
            `/api/workspace/${workspace}/dm/${id}/chat`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            },
          )
          .catch(console.error);
      }
    },
    [chat, workspace, id, myData, userData, chatData],
  );

  return (
    <div>
      <Header>
        {userData && (
          <>
            <img src={gravatar.url(userData.email, { s: '24px' })} alt={userData.nickname} />
            <span>{userData.nickname}</span>
          </>
        )}
      </Header>
      <ChatList />
      {userData && (
        <ChatBox
          placeholder={`Message ${userData.nickname}`}
          data={[]}
          onChangeChat={onChangeChat}
          onSubmitForm={onSubmitForm}
          chat={chat}
        />
      )}
    </div>
  );
};

export default DirectMessage;
