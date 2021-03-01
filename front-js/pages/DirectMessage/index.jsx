import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { Header, Container } from '@pages/DirectMessage/styles';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import axios from 'axios';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR, { useSWRInfinite } from 'swr';

const PAGE_SIZE = 20;
const DirectMessage = () => {
  const { workspace, id } = useParams();
  const [socket] = useSocket(workspace);
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef(null);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          if (scrollbarRef.current) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            scrollbarRef.current.scrollToBottom();
          }
        });
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .catch(console.error);
      }
    },
    [chat, workspace, id, myData, userData, chatData],
  );

  const onMessage = (data) => {
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            scrollbarRef.current.scrollToBottom();
          } else {
            toast.success('새 메시지가 도착했습니다.', {
              onClick() {
                scrollbarRef.current?.scrollToBottom();
              },
              closeOnClick: true,
            });
          }
        }
      });
    }
  };

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, id, myData]);

  useEffect(() => {
    if (chatData?.length === 1) {
      console.log('toBottomWhenLoaded', chatData, scrollbarRef.current?.getValues());
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        scrollbarRef={scrollbarRef}
        isReachingEnd={isReachingEnd}
        isEmpty={isEmpty}
        chatSections={chatSections}
        setSize={setSize}
      />
      <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message ${userData.nickname}`}
        data={[]}
      />
    </Container>
  );
};

export default DirectMessage;
