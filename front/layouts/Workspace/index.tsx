import useInput from '@hooks/useInput';
import Channel from '@pages/Channel';
import DirectMessage from '@pages/DirectMessage';
import { Button, Input, Label } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import useSWR from 'swr';
import {
  AddButton,
  Channels,
  Chats,
  CloseModalButton,
  CreateWorkspaceModal,
  Header, LogOutButton,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
} from './styles';

const Workspace = () => {
  const { data: userData, revalidate } = useSWR('/api/user', fetcher);
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: channelData } = useSWR<Array<{ id: number, name: string }>>(`/api/workspace/${workspace}/channels`, fetcher);
  const { data: workspaceData } = useSWR<Array<{ id: number, name: string, url: string }>>(`/api/workspaces`, fetcher);
  const { data: memberData } = useSWR<Array<{ id: number, nickname: string }>>(`/api/workspace/${workspace}/members`, fetcher);
  const [showModal, setShowModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace] = useInput('');

  const onLogOut = useCallback(() => {
    axios.post('/api/logout')
      .then(() => {
        revalidate();
      })
      .catch(console.error);
  }, []);

  const onClickAddWorkspace = useCallback(() => {
    setShowModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  if (userData === false) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span onClick={onClickUserProfile}>
              <ProfileImg src={gravatar.url(userData.email, { s: '28px' })} alt={userData.nickname} />
            </span>
            {showUserMenu && (
              <ProfileModal>
                <div style={{ display: 'flex' }}>
                  <img src={gravatar.url(userData.email, { s: '36px' })} alt={userData.nickname} />
                  <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </div>
                <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
              </ProfileModal>
            )}
          </RightMenu>
        )}
      </Header>
      <Workspaces>
        {workspaceData?.map((ws) => {
          return (
            <Link key={ws.id} to={`/workspace/${ws.url}`}>
              <WorkspaceButton>
                {ws.name.slice(0, 1).toUpperCase()}
              </WorkspaceButton>
            </Link>
          );
        })}
        <AddButton onClick={onClickAddWorkspace}>+</AddButton>
      </Workspaces>
      <Channels>
        <WorkspaceName onClick={toggleWorkspaceModal}>
          {workspaceData?.find((v) => v.url === workspace)?.name}
        </WorkspaceName>
        {showWorkspaceModal && (
          <WorkspaceModal>
            <button>워크스페이스에 사용자 초대</button>
            <button>채널 만들기</button>
            <button onClick={onLogOut}>로그아웃</button>
          </WorkspaceModal>
        )}
        <h2>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse" aria-hidden="true" />
          <span>Channels</span>
          <button
            className="c-button-unstyled p-channel_sidebar__section_heading_right_item p-channel_sidebar__section_heading_plus"
            aria-hidden="true" tabIndex={-1} data-qa="channel_sidebar__plus__channels"
            data-sk="tooltip_parent" type="button" />
        </h2>
        <div>
          {channelData?.map((channel) => {
            return (
              <Link key={channel.name} to={`/workspace/${workspace}/channel/${channel.name}`}># {channel.name}</Link>);
          })}
        </div>
        <h2>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse" aria-hidden="true" />
          <span>Direct Messages</span>
          <button
            className="c-button-unstyled p-channel_sidebar__section_heading_right_item p-channel_sidebar__section_heading_plus"
            aria-hidden="true" tabIndex={-1} data-qa="channel_sidebar__plus__channels"
            data-sk="tooltip_parent" type="button" />
        </h2>
        <div>
          {memberData?.map((member) => {
            return (
              <Link key={member.id} to={`/workspace/${workspace}/dm/${member.id}`}>
                <i
                  className="c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence c-icon--presence-offline"
                  aria-hidden="true" data-qa="presence_indicator"
                  data-qa-presence-self="false" data-qa-presence-active="false" data-qa-presence-dnd="false" />
                <i
                  className="c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence c-presence--active c-icon--presence-online"
                  aria-hidden="true"
                  data-qa="presence_indicator" data-qa-presence-self="false" data-qa-presence-active="false"
                  data-qa-presence-dnd="false" />
                <i
                  className="c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence c-presence--active c-icon--presence-online"
                  aria-hidden="true"
                  data-qa="presence_indicator" data-qa-presence-self="false" data-qa-presence-active="false"
                  data-qa-presence-dnd="false" />
                {member.nickname}
              </Link>
            );
          })}
          <button
            className="c-button-unstyled p-channel_sidebar__link p-channel_sidebar__link--invites p-channel_sidebar__link--dim"
            role="presentation" data-sidebar-link-id="Vinvites" data-qa-channel-sidebar-link-id="Vinvites"
            type="button">
            <span className="p-channel_sidebar__name" data-qa="channel_sidebar_name_invite_people">Invite people</span>
          </button>
        </div>
      </Channels>
      <Chats>
        <Switch>
          <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
          <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
        </Switch>
      </Chats>
      {showModal && (
        <CreateWorkspaceModal>
          <div>
            <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
            <div>
              <Label id="workspace-label">
                <span>워크스페이스 이름</span>
                <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                <Button>생성하기</Button>
              </Label>
            </div>
          </div>
        </CreateWorkspaceModal>
      )}
    </div>
  );
};

export default Workspace;
