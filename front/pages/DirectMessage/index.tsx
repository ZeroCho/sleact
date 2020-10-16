import Chat from '@components/Chat';
import useInput from '@hooks/useInput';
import { IChat } from '@typings/db';
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
import { toast, ToastContainer } from 'react-toastify';
import useSWR from 'swr';

const makeSection = (chatList: IChat[]) => {
  const sections: { [key: string]: IChat[] } = {};
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
const DirectMessage: FC<Props> = ({ socket }) => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR('/api/user', fetcher);
  const { data: userData } = useSWR(`/api/workspace/${workspace}/user/${id}`, fetcher);
  const { data: chatData, revalidate: revalidateChat } = useSWR<IChat[]>(
    `/api/workspace/${workspace}/dm/${id}/chats`,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log(chat);
      if (chat?.trim()) {
        axios
          .post(`/api/workspace/${workspace}/dm/${id}/chat`, {
            content: chat,
          })
          .then(() => {
            setChat('');
            revalidateChat().then(() => {
              if (scrollbarRef.current) {
                scrollbarRef.current.scrollToBottom();
              }
            });
          })
          .catch(console.error);
      }
    },
    [chat, workspace, id, scrollbarRef],
  );

  useEffect(() => {
    autosize(document.querySelector('#editor-chat')!);
  }, [chat]);

  useEffect(() => {
    socket?.on('message', () => {
      revalidateChat().then(() => {
        console.log('onmessage revalidate');
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 200
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

  useEffect(() => {}, [id]);

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

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData || []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', height: 'calc(100vh - 38px)', flexFlow: 'column' }}>
      <Header>
        <span>{userData.nickname}</span>
      </Header>
      <ChatZone>
        <Scrollbars autoHide ref={scrollbarRef}>
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
