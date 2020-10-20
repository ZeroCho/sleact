import Menu from '@components/Menu';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import Channel from '@pages/Channel';
import DirectMessage from '@pages/DirectMessage';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChat, IDM, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router';
import { Link, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import useSWR from 'swr';

import {
  AddButton,
  Channels,
  Chats,
  CollapseButton,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
} from './styles';

const Workspace = () => {
  const params = useParams<{ workspace?: string }>();
  const location = useLocation();
  const routeMatch = useRouteMatch();
  const history = useHistory();
  // console.log('params', params, 'location', location, 'routeMatch', routeMatch, 'history', history);
  const { workspace } = params;
  const { data: userData, revalidate } = useSWR('/api/user', fetcher);
  const { data: workspaceData, revalidate: revalidateWorkspace } = useSWR<
    Array<{ id: number; name: string; url: string }>
  >(userData ? `/api/workspaces` : null, fetcher);
  const { data: channelData, revalidate: revalidateChannel } = useSWR<Array<{ id: number; name: string }>>(
    userData ? `/api/workspace/${workspace}/channels` : null,
    fetcher,
  );
  const { data: memberData, revalidate: revalidateMembers, mutate: mutateMember } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspace/${workspace}/members` : null,
    fetcher,
  );
  console.log('rerender', memberData);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});
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
  }, []);

  const toggleDMCollapse = useCallback(() => {
    setDMCollapse((prev) => !prev);
  }, []);

  const onLogOut = useCallback(() => {
    axios
      .post('/api/logout')
      .then(() => {
        revalidate();
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post('/api/workspace', {
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
        });
    },
    [newWorkspace, newUrl],
  );
  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(`/api/workspace/${workspace}/channel`, {
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
    },
    [newChannel],
  );
  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(`/api/workspace/${workspace}/member`, {
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
    },
    [newMember],
  );

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

  const socketRef = useRef<SocketIOClient.Socket>();
  useEffect(() => {
    if (workspaceData) {
      const backUrl = process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3095';
      const socket = io(`${backUrl}/ws-${workspace}`, {
        transports: ['websocket'],
      });
      socket.on('hello', (data: string) => {
        console.log(`${data} connected`);
      });
      socket.on('onlineList', (data: number[]) => {
        setOnlineList(data);
      });
      socket.on('offline', (data: number) => {
        console.log('offline', workspace, data);
        setOnlineList((list) => {
          return list.filter((v) => v !== data);
        });
      });
      socket.on('dm', (data: IDM) => {
        setCountList((list) => {
          return {
            ...list,
            [data.SenderId]: list[data.SenderId] ? list[data.SenderId] + 1 : 1,
          };
        });
      });
      socket.on('message', (data: IChat) => {
        setCountList((list) => {
          return {
            ...list,
            [`c-${data.ChannelId}`]: 1,
          };
        });
      });
      socketRef.current = socket;
    }
    return () => {
      console.log('clear', workspace);
      socketRef.current?.disconnect();
      socketRef.current = undefined;
      setOnlineList([]);
    };
  }, [workspace, workspaceData, userData]);

  useEffect(() => {
    if (channelData) {
      socketRef.current?.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) });
    }
  }, [channelData]);

  const resetCount = useCallback(
    (id) => () => {
      setCountList((list) => {
        return {
          ...list,
          [id]: 0,
        };
      });
    },
    [],
  );

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
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal style={{ display: 'flex' }}>
                  <img src={gravatar.url(userData.email, { s: '36px' })} alt={userData.nickname} />
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
              </Menu>
            )}
          </RightMenu>
        )}
      </Header>
      <Workspaces>
        {workspaceData?.map((ws) => {
          return (
            <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
              <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
            </Link>
          );
        })}
        <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
      </Workspaces>
      <Channels>
        <WorkspaceName onClick={toggleWorkspaceModal}>
          {workspaceData?.find((v) => v.url === workspace)?.name}
        </WorkspaceName>
        <MenuScroll>
          <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
            <WorkspaceModal>
              <h2>{workspaceData?.find((v) => v.url === workspace)?.name}</h2>
              <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
              <button onClick={onClickAddChannel}>채널 만들기</button>
              <button onClick={onLogOut}>로그아웃</button>
            </WorkspaceModal>
          </Menu>
          <h2>
            <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
              <i
                className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                data-qa="channel-section-collapse"
                aria-hidden="true"
              />
            </CollapseButton>
            <span>Channels</span>
          </h2>
          <div>
            {!channelCollapse &&
              channelData?.map((channel) => {
                const count = countList[`c-${channel.id}`] || 0;
                return (
                  <NavLink
                    key={channel.name}
                    activeClassName="selected"
                    to={`/workspace/${workspace}/channel/${channel.name}`}
                    onClick={resetCount(`c-${channel.id}`)}
                  >
                    <span className={count > 0 ? 'bold' : undefined}># {channel.name}</span>
                  </NavLink>
                );
              })}
          </div>
          <h2>
            <CollapseButton collapse={dmCollapse} onClick={toggleDMCollapse}>
              <i
                className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                data-qa="channel-section-collapse"
                aria-hidden="true"
              />
            </CollapseButton>
            <span>Direct Messages</span>
          </h2>
          <div>
            {!dmCollapse &&
              memberData?.map((member) => {
                const isOnline = onlineList.includes(member.id);
                const count = countList[member.id] || 0;
                return (
                  <NavLink
                    key={member.id}
                    activeClassName="selected"
                    to={`/workspace/${workspace}/dm/${member.id}`}
                    onClick={resetCount(member.id)}
                  >
                    <i
                      className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                        isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                      }`}
                      aria-hidden="true"
                      data-qa="presence_indicator"
                      data-qa-presence-self="false"
                      data-qa-presence-active="false"
                      data-qa-presence-dnd="false"
                    />
                    <span className={count > 0 ? 'bold' : undefined}>{member.nickname}</span>
                    {member.id === userData.id && <span> (나)</span>}
                    {count > 0 && <span className="count">{count}</span>}
                  </NavLink>
                );
              })}
          </div>
        </MenuScroll>
      </Channels>
      <Chats>
        <Switch>
          <Route
            path="/workspace/:workspace/channel/:channel"
            render={(props) => <Channel {...props} socket={socketRef.current} />}
          />
          <Route
            path="/workspace/:workspace/dm/:id"
            render={(props) => <DirectMessage {...props} socket={socketRef.current} />}
          />
        </Switch>
      </Chats>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
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
      </Modal>
      <Modal show={showCreateChannelModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel}>
          <Label id="channel-label">
            <span>채널 이름</span>
            <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
          </Label>
          <Button>생성하기</Button>
        </form>
      </Modal>
      <Modal show={showInviteWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <Label id="member-label">
            <span>이메일</span>
            <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
          </Label>
          <Button type="submit">초대하기</Button>
        </form>
      </Modal>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default Workspace;
