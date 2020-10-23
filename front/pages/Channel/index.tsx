import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { Header } from '@pages/Channel/styles';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import useSWR, { useSWRInfinite } from 'swr';

const PAGE_SIZE = 20;
const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [socket] = useSocket(workspace);
  const { data: userData, revalidate } = useSWR<IUser>('/api/user', fetcher);
  const { data: channelsData } = useSWR<IChannel[]>(`/api/workspace/${workspace}/channels`, fetcher);
  const channelData = channelsData?.find((v) => v.name === channel);
  const { data: chatData, revalidate: revalidateChat, mutate: mutateChat, setSize } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspace/${workspace}/channel/${channel}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  const { data: channelMembersData, revalidate: revalidateMembers } = useSWR<IUser[]>(
    userData ? `/api/workspace/${workspace}/channel/${channel}/members` : null,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const scrollbarRef = useRef<Scrollbars>(null);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(`/api/workspace/${workspace}/channel/${channel}/member`, {
          email: newMember,
        })
        .then(() => {
          revalidateMembers();
          setShowInviteChannelModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember],
  );

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData && channelData && userData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: userData.id,
            User: userData,
            createdAt: new Date(),
            ChannelId: channelData.id,
            Channel: channelData,
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          if (scrollbarRef.current) {
            console.log('scrollToBottom!');
            scrollbarRef.current.scrollToBottom();
          }
        });
        axios
          .post(`/api/workspace/${workspace}/channel/${channel}/chat`, {
            content: savedChat,
          })
          .catch(console.error);
      }
    },
    [chat, workspace, channel, channelData, scrollbarRef.current, userData, chatData],
  );

  const onMessage = (data: IChat) => {
    if (data.Channel.name === channel && data.UserId !== userData?.id) {
      mutateChat((chatData) => {
        chatData[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!');
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
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [scrollbarRef.current, socket, userData]);

  useEffect(() => {
    if (chatData?.length === 1) {
      console.log('toBottom', chatData);
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData, scrollbarRef.current]);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  if (channelsData && !channelData) {
    return <Redirect to={`/workspace/${workspace}/channel/일반`} />;
  }

  const chatSections = makeSection(chatData ? ([] as IChat[]).concat(...chatData).reverse() : []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', height: 'calc(100vh - 38px)', flexFlow: 'column' }}>
      <Header>
        <span>#{channel}</span>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
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
        placeholder={`Message #${channel}`}
        data={channelMembersData}
      />
      <Modal show={showInviteChannelModal} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <Label id="member-label">
            <span>채널 멤버 초대</span>
            <Input id="member" value={newMember} onChange={onChangeNewMember} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default Channel;
