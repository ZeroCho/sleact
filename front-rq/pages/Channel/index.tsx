import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import InviteChannelModal from '@components/InviteChannelModal';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { Container, Header, DragOver } from '@pages/Channel/styles';
import { IChannel, IChat, IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router';
import { useQuery, useInfiniteQuery, InfiniteData, useQueryClient, useMutation } from 'react-query';

const Channel = () => {
  const queryClient = useQueryClient();
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useQuery('user', () => fetcher({ queryKey: '/api/users' }));
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: channelData } = useQuery<IChannel>(['workspace', workspace, 'channel', channel, 'chat'], () =>
    fetcher({ queryKey: `/api/workspaces/${workspace}/channels/${channel}` }),
  );
  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<IChat[]>(
    ['workspace', workspace, 'channel', channel, 'chat'],
    ({ pageParam }) =>
      fetcher({ queryKey: `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${pageParam + 1}` }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return;
        return pages.length;
      },
    },
  );
  const { data: channelMembersData } = useQuery<IUser[]>(
    ['workspace', workspace, 'channel', channel, 'member'],
    () => fetcher({ queryKey: `/api/workspaces/${workspace}/channels/${channel}/members` }),
    {
      enabled: !!myData,
    },
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.pages[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData.pages[chatData.pages.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const mutation = useMutation<IDM, AxiosError, { content: string }>(
    ['workspace', workspace, 'channel', channel, 'chat'],
    () => fetcher({ queryKey: `/api/workspaces/${workspace}/channels/${channel}/chats` }),
    {
      onMutate(mutateData) {
        if (!channelData) return;
        queryClient.setQueryData<InfiniteData<IChat[]>>(
          ['workspace', workspace, 'channel', channel, 'chat'],
          (data) => {
            const newPages = data?.pages.slice() || [];
            newPages[0].unshift({
              id: (data?.pages[0][0]?.id || 0) + 1,
              content: mutateData.content,
              UserId: myData.id,
              User: myData,
              ChannelId: channelData.id,
              Channel: channelData,
              createdAt: new Date(),
            });
            return {
              pageParams: data?.pageParams || [],
              pages: newPages,
            };
          },
        );
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      },
      onError(error) {
        console.error(error);
      },
      onSuccess() {
        queryClient.refetchQueries(['workspace', workspace, 'channel', channel, 'chat']);
      },
    },
  );
  // 0초 A: 안녕~(optimistic UI)
  // 1초 B: 안녕~
  // 2초 A: 안녕~(실제 서버)
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log(chat);
      if (chat?.trim() && chatData && channelData) {
        mutation.mutate({ content: chat });
      }
    },
    [chat, chatData, channelData, mutation],
  );

  const onMessage = useCallback(
    (data: IChat) => {
      // id는 상대방 아이디
      if (data.Channel.name === channel && (data.content.startsWith('uploads\\') || data.UserId !== myData?.id)) {
        queryClient.setQueryData<InfiniteData<IChat[]>>(
          ['workspace', workspace, 'channel', channel, 'chat'],
          (prev) => {
            const newPages = prev?.pages.slice() || [];
            newPages[0].unshift(data);
            return {
              pageParams: prev?.pageParams || [],
              pages: newPages,
            };
          },
        );
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 50);
          }
        }
      }
    },
    [channel, myData, queryClient, workspace],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.pages.length === 1) {
      console.log('toBottomWhenLoaded', scrollbarRef.current);
      setTimeout(() => {
        console.log('scrollbar', scrollbarRef.current);
        scrollbarRef.current?.scrollToBottom();
      }, 500);
    }
  }, [chatData]);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  const onChangeFile = useCallback(
    (e) => {
      const formData = new FormData();
      if (e.target.files) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i].getAsFile();
          console.log('... file[' + i + '].name = ' + file.name);
          formData.append('image', file);
        }
      }
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData).then(() => {});
    },
    [channel, workspace],
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      console.log(e);
      const formData = new FormData();
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData).then(() => {
        setDragOver(false);
      });
    },
    [workspace, channel],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
  }, []);

  if (!myData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.pages.flat().reverse() : []);

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
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
        chatSections={chatSections}
        ref={scrollbarRef}
        fetchNext={fetchNextPage}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
};

export default Channel;
