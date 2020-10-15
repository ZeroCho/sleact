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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  AddButton,
  Channels,
  Chats,
  CloseModalButton, CollapseButton,
  CreateModal,
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
  const { data: channelData, revalidate: revalidateChannel } = useSWR<Array<{ id: number, name: string }>>(`/api/workspace/${workspace}/channels`, fetcher);
  const { data: workspaceData, revalidate: revalidateWorkspace } = useSWR<Array<{ id: number, name: string, url: string }>>(`/api/workspaces`, fetcher);
  const { data: memberData, revalidate: revalidateMembers } = useSWR<Array<{ id: number, nickname: string }>>(`/api/workspace/${workspace}/members`, fetcher);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [dmCollapse, setDMCollapse] = useState(false);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, [])

  const toggleDMCollapse = useCallback(() => {
    setDMCollapse((prev) => !prev);
  }, [])

  const onLogOut = useCallback(() => {
    axios.post('/api/logout')
      .then(() => {
        revalidate();
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, []);

  const onCreateWorkspace = useCallback((e) => {
    e.preventDefault();
    axios.post('/api/workspace', {
      workspace: newWorkspace,
      url: newUrl,
    })
      .then(() => {
        revalidateWorkspace();
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      })
  }, [newWorkspace, newUrl]);
  const onCreateChannel = useCallback((e) => {
    e.preventDefault();
    axios.post(`/api/workspace/${workspace}/channel`, {
      name: newChannel,
    })
      .then(() => {
        revalidateChannel();
        setShowCreateChannelModal(false);
        setNewChannel('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [newChannel]);
  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    axios.post(`/api/workspace/${workspace}/member`, {
      email: newMember,
    })
      .then(() => {
        revalidateMembers();
        revalidateChannel();
        setShowInviteWorkspaceModal(false);
        setNewMember('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [newMember]);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
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
        <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
      </Workspaces>
      <Channels>
        <WorkspaceName onClick={toggleWorkspaceModal}>
          {workspaceData?.find((v) => v.url === workspace)?.name}
        </WorkspaceName>
        {showWorkspaceModal && (
          <WorkspaceModal>
            <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
            <button onClick={onClickAddChannel}>채널 만들기</button>
            <button onClick={onLogOut}>로그아웃</button>
          </WorkspaceModal>
        )}
        <h2>
          <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
            <i
              className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
              data-qa="channel-section-collapse" aria-hidden="true" />
          </CollapseButton>
          <span>Channels</span>
        </h2>
        <div>
          {!channelCollapse && channelData?.map((channel) => {
            return (
              <Link key={channel.name} to={`/workspace/${workspace}/channel/${channel.name}`}># {channel.name}</Link>);
          })}
        </div>
        <h2>
          <CollapseButton collapse={dmCollapse} onClick={toggleDMCollapse}>
            <i
              className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
              data-qa="channel-section-collapse" aria-hidden="true" />
          </CollapseButton>
          <span>Direct Messages</span>
        </h2>
        <div>
          {!dmCollapse && memberData?.map((member) => {
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
        </div>
      </Channels>
      <Chats>
        <Switch>
          <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
          <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
        </Switch>
      </Chats>
      {showCreateWorkspaceModal && (
        <CreateModal>
          <div>
            <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
            <form onSubmit={onCreateWorkspace}>
              <Label id="workspace-label">
                <span>워크스페이스 이름</span>
                <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
              </Label>
              <Label id="workspace-url-label">
                <span>워크스페이스 url</span>
                <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
              </Label>
              <Button type="submit">생성하기</Button>
            </form>
          </div>
        </CreateModal>
      )}
      {showCreateChannelModal && (
        <CreateModal>
          <div>
            <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
            <form onSubmit={onCreateChannel}>
              <Label id="channel-label">
                <span>채널 이름</span>
                <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
              </Label>
              <Button>생성하기</Button>
            </form>
          </div>
        </CreateModal>
      )}
      {showInviteWorkspaceModal && (
        <CreateModal>
          <div>
            <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
            <form onSubmit={onInviteMember}>
              <Label id="member-label">
                <span>이메일</span>
                <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
              </Label>
              <Button type="submit">초대하기</Button>
            </form>
          </div>
        </CreateModal>
      )}
      <ToastContainer
        position="bottom-center"
      />
    </div>
  );
};

export default Workspace;
