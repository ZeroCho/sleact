import Chat from '@components/Chat';
import useInput from '@hooks/useInput';
import { IDM } from '@typings/db';
import {
  ChatArea,
  ChatZone,
  Form,
  Header,
  MentionsTextarea,
  Section,
  SendButton,
  StickyHeader,
  Toolbox,
} from '@pages/Channel/styles';
import fetcher from '@utils/fetcher';
import autosize from 'autosize';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Mention } from 'react-mentions';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR, { useSWRInfinite } from 'swr';

const makeSection = (chatList: IDM[]) => {
  const sections: { [key: string]: IDM[] } = {};
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
};

interface Props {
  socket?: SocketIOClient.Socket;
}

const PAGE_SIZE = 15;
const DirectMessage: FC<Props> = ({ socket }) => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR('/api/user', fetcher);
  const { data: userData } = useSWR(`/api/workspace/${workspace}/user/${id}`, fetcher);
  const { data: chatData, revalidate: revalidateChat, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspace/${workspace}/dm/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  );
  console.log('chatData', chatData);
  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log(chat);
      if (chat?.trim() && chatData) {
        axios
          .post(`/api/workspace/${workspace}/dm/${id}/chat`, {
            content: chat,
          })
          .then(() => {
            setChat('');
            mutateChat((prevChatData) => {
              prevChatData[0].unshift({
                id: chatData[0][0].id + 1,
                content: chat,
                SenderId: myData.id,
                Sender: myData,
                ReceiverId: userData.id,
                Receiver: userData,
                createdAt: new Date(),
              });
              return prevChatData;
            }, false).then(() => {
              if (scrollbarRef.current) {
                scrollbarRef.current.scrollToBottom();
              }
            });
          })
          .catch(console.error);
      }
    },
    [chat, workspace, id, scrollbarRef, userData, chatData],
  );

  useEffect(() => {
    autosize(document.querySelector('#editor-chat')!);
  }, [chat]);

  useEffect(() => {
    socket?.on('message', (data: IDM) => {
      mutateChat((chatData) => {
        chatData[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
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
    });
    return () => {
      socket?.off('message');
    };
  }, [scrollbarRef, socket]);

  useEffect(() => {
    if (chatData?.length === 1) {
      console.log('toBottom', chatData);
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData, scrollbarRef]);

  const onKeydownChat = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [chat],
  );

  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
        setSize((size) => size + 1).then(() => {
          scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
        });
      }
    },
    [isReachingEnd, isEmpty],
  );

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? ([] as IDM[]).concat(...chatData).reverse() : []);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', height: 'calc(100vh - 38px)', flexFlow: 'column' }}>
      <Header>
        <span>{userData.nickname}</span>
      </Header>
      <ChatZone>
        <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
          {Object.entries(chatSections).map(([date, chats]) => {
            return (
              <Section className={`section-${date}`} key={date}>
                <StickyHeader>
                  <button>{date}</button>
                </StickyHeader>
                {chats.map((chat) => (
                  <Chat key={chat.id} data={chat} />
                ))}
              </Section>
            );
          })}
        </Scrollbars>
      </ChatZone>
      <ChatArea>
        <Form onSubmit={onSubmitForm}>
          <MentionsTextarea
            id="editor-chat"
            value={chat}
            onChange={onChangeChat}
            onKeyDown={onKeydownChat}
            placeholder={`Message ${userData.nickname}`}
          >
            <Mention
              appendSpaceOnAdd
              style={{ background: 'rgba(29, 155, 209, .1)', color: 'rgb(18, 100, 163)' }}
              trigger="@"
              data={[]}
              renderSuggestion={() => null}
            />
          </MentionsTextarea>
          <Toolbox>
            <SendButton
              className={
                'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
                (chat?.trim() ? '' : ' c-texty_input__button--disabled')
              }
              data-qa="texty_send_button"
              aria-label="Send message"
              data-sk="tooltip_parent"
              type="submit"
              disabled={!chat?.trim()}
            >
              <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
            </SendButton>
          </Toolbox>
        </Form>
      </ChatArea>
    </div>
  );
};

export default DirectMessage;
