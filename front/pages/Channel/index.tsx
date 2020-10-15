import Chat from '@components/Chat';
import Menu from '@components/Menu';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
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
  EachMention,
} from '@pages/Channel/styles';
import { Button, Input, Label } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import autosize from 'autosize';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import useSWR from 'swr';
import { Scrollbars } from 'react-custom-scrollbars';
import gravatar from 'gravatar';
import { Mention, SuggestionDataItem } from 'react-mentions';

export interface IChat {
  id: number;
  UserId: number;
  User: {
    nickname: string;
    email: string;
  };
  content: string;
  createdAt: Date;
}

const dummyChat: IChat[] = [
  {
    id: 1,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content:
      '첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글첫째 댓글',
    createdAt: new Date(2020, 8, 13),
  },
  {
    id: 2,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content: '둘째 댓글',
    createdAt: new Date(2020, 8, 13),
  },
  {
    id: 3,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content: '셋째 댓글',
    createdAt: new Date(2020, 8, 14),
  },
  {
    id: 4,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content:
      '넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글넷째 댓글',
    createdAt: new Date(2020, 8, 14),
  },
  {
    id: 5,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content: '다섯째 댓글',
    createdAt: new Date(2020, 8, 15),
  },
  {
    id: 6,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content: '다섯째 댓글',
    createdAt: new Date(2020, 8, 15),
  },
  {
    id: 7,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content: '다섯째 댓글',
    createdAt: new Date(2020, 8, 15),
  },
  {
    id: 8,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content: '다섯째 댓글',
    createdAt: new Date(2020, 8, 15),
  },
  {
    id: 9,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content: '다섯째 댓글',
    createdAt: new Date(2020, 8, 16),
  },
  {
    id: 10,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content: '다섯째 댓글',
    createdAt: new Date(2020, 8, 17),
  },
  {
    id: 11,
    UserId: 1,
    User: { nickname: '제로초', email: 'zerohch0@gmail.com' },
    content: '다섯째 댓글',
    createdAt: new Date(2020, 8, 18),
  },
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
};

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  // const { data: chatData } = useSWR<Array<{ id: number, content: string }>>(`/api/workspace/${workspace}/channel/${channel}/chats`, fetcher);
  const { data: channelMembersData, revalidate: revalidateMembers } = useSWR<
    Array<{ id: number; email: string; nickname: string }>
  >(`/api/workspace/${workspace}/channel/${channel}/members`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
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

  const onSubmitForm = useCallback(() => {
    console.log(chat);
    if (chat?.trim()) {
      // axios
      //   .post(`/api/channel/${channel}/chat`)
      //   .then(() => {})
      //   .catch(console.error);
    }
  }, [chat]);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  useEffect(() => {
    autosize(document.querySelector('#editor-chat')!);
  }, [chat]);

  const onKeydownChat = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm();
        }
      }
    },
    [chat],
  );

  const renderUserSuggestion: (
    suggestion: SuggestionDataItem,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean,
  ) => React.ReactNode = useCallback(
    (member, search, highlightedDisplay, index, focus) => {
      if (!channelMembersData) {
        return null;
      }
      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(channelMembersData[index].email, { s: '20px' })}
            alt={channelMembersData[index].nickname}
          />
          <span>{channelMembersData[index].nickname}</span>
        </EachMention>
      );
    },
    [channelMembersData],
  );

  const chatSections = makeSection(dummyChat);

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
      <ChatZone>
        <Scrollbars autoHide>
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
            placeholder={`Message #${channel}`}
          >
            <Mention
              appendSpaceOnAdd
              style={{ background: 'rgba(29, 155, 209, .1)', color: 'rgb(18, 100, 163)' }}
              trigger="@"
              data={channelMembersData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
              renderSuggestion={renderUserSuggestion}
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
