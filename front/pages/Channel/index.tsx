import useInput from '@hooks/useInput';
import { ChatArea, ChatZone, Form, Header, SendButton, StickyHeader, Toolbox } from '@pages/Channel/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import autosize from 'autosize';
import dayjs from 'dayjs';
import Chat from '@components/Chat';

export interface IChat {
  id: number,
  UserId: number,
  User: {
    nickname: string,
    email: string,
  },
  content: string,
  createdAt: Date,
}
const dummyChat: IChat[] = [
  { id: 1, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글', createdAt: new Date(2020, 8, 13) },
  { id: 2, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '둘째 댓글', createdAt: new Date(2020, 8, 13) },
  { id: 3, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '셋째 댓글', createdAt: new Date(2020, 8, 14) },
  { id: 4, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글', createdAt: new Date(2020, 8, 14) },
  { id: 5, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '다섯째 댓글', createdAt: new Date(2020, 8, 15) },
  { id: 6, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '다섯째 댓글', createdAt: new Date(2020, 8, 15) },
  { id: 7, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '다섯째 댓글', createdAt: new Date(2020, 8, 15) },
  { id: 8, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '다섯째 댓글', createdAt: new Date(2020, 8, 15) },
  { id: 9, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '다섯째 댓글', createdAt: new Date(2020, 8, 16) },
  { id: 10, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '다섯째 댓글', createdAt: new Date(2020, 8, 17) },
  { id: 11, UserId: 1, User: { nickname: '제로초', email: 'zerohch0@gmail.com' }, content: '다섯째 댓글', createdAt: new Date(2020, 8, 18) },
];

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
}

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();
  // const { data: chatData } = useSWR<Array<{ id: number, content: string }>>(`/api/workspace/${workspace}/channel/${channel}/chats`, fetcher);
  const { data: channelMembersData } = useSWR<Array<{ id: number, content: string }>>(`/api/workspace/${workspace}/channel/${channel}/members`, fetcher);
  const [chat, onChangeChat] = useInput('');

  const onSubmitForm = useCallback(() => {
    if (chat?.trim()) {
      axios.post(`/api/channel/${channel}/chat`)
        .then(() => {

        })
        .catch(console.error);
    }
  }, [chat]);

  useEffect(() => {
    autosize(document.querySelector('#editor-chat')!)
    const listener = () => {
      console.log('hi');
    };
    window.addEventListener('scroll', listener);
    return () => {
      window.addEventListener('scroll', listener);
    }
  }, []);

  const onKeydownChat = useCallback((e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        onSubmitForm();
      }
    } else {

    }
  }, [chat]);

  const chatSections = makeSection(dummyChat);

  return (
    <div>
      <Header>
        <span>#{channel}</span>
        <span>{channelMembersData?.length}</span>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
          <button className="c-button-unstyled p-ia__view_header__button" aria-label="Add people to #react-native" data-sk="tooltip_parent" type="button">
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatZone>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <div className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => <Chat key={chat.id} data={chat} />)}
            </div>
          );
        })}
      </ChatZone>
      <ChatArea>
        <Form onSubmit={onSubmitForm}>
          <textarea
            id="editor-chat"
            placeholder={`Message #${channel}`}
            value={chat}
            onChange={onChangeChat}
            onKeyDown={onKeydownChat}
          />
          <Toolbox>
            <SendButton
              className={'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' + (chat?.trim() ? '' : ' c-texty_input__button--disabled')}
              data-qa="texty_send_button" aria-label="Send message" data-sk="tooltip_parent" type="submit"
              disabled={!(chat?.trim())}>
              <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
            </SendButton>
          </Toolbox>
        </Form>
      </ChatArea>
    </div>
  );
};

export default Channel;
