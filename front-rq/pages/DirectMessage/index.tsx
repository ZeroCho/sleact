import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { Container, Header, DragOver } from '@pages/DirectMessage/styles';
import { IDM } from '@typings/db';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import gravatar from 'gravatar';
import Scrollbars from 'react-custom-scrollbars-2';
import { useQuery, useQueryClient, useInfiniteQuery, useMutation, InfiniteData } from 'react-query';
import { useParams } from 'react-router';

const DirectMessage = () => {
  const queryClient = useQueryClient();
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useQuery(['workspace', workspace, 'users', id], () =>
    fetcher({ queryKey: `/api/workspaces/${workspace}/users/${id}` }),
  );
  const { data: myData } = useQuery('user', () => fetcher({ queryKey: '/api/users' }));
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<IDM[]>(
    ['workspace', workspace, 'dm', id, 'chat'],
    ({ pageParam }) =>
      fetcher({ queryKey: `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${pageParam + 1}` }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return;
        return pages.length;
      },
    },
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.pages[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData?.pages[chatData?.pages.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);
  const [dragOver, setDragOver] = useState(false);

  const mutation = useMutation<IDM, AxiosError, { content: string }>(
    ['workspace', workspace, 'dm', id, 'chat'],
    () => fetcher({ queryKey: `/api/workspaces/${workspace}/dms/${id}/chats` }),
    {
      onMutate(mutateData) {
        queryClient.setQueryData<InfiniteData<IDM[]>>(['workspace', workspace, 'dm', id, 'chat'], (data) => {
          const newPages = data?.pages.slice() || [];
          newPages[0].unshift({
            id: (data?.pages[0][0]?.id || 0) + 1,
            content: mutateData.content,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return {
            pageParams: data?.pageParams || [],
            pages: newPages,
          };
        });
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      },
      onError(error) {
        console.error(error);
      },
      onSuccess() {
        queryClient.refetchQueries(['workspace', workspace, 'dm', id, 'chat']);
      },
    },
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log(chat);
      if (chat?.trim() && chatData) {
        mutation.mutate({ content: chat });
      }
    },
    [chat, chatData, mutation],
  );

  const onMessage = useCallback(
    (data: IDM) => {
      // id는 상대방 아이디
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        queryClient.setQueryData<InfiniteData<IDM[]>>(['workspace', workspace, 'dm', id, 'chat'], (prev) => {
          const newPages = prev?.pages.slice() || [];
          newPages[0].unshift(data);
          return {
            pageParams: prev?.pageParams || [],
            pages: newPages,
          };
        });
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
    [workspace, id, myData.id, queryClient],
  );

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.pages.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);

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
      axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
        setDragOver(false);
        queryClient.refetchQueries(['workspace', workspace, 'dm', id, 'chat']);
      });
    },
    [queryClient, workspace, id],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
  }, []);

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.pages.flat().reverse() : []);

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        fetchNext={fetchNextPage}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
};

export default DirectMessage;
