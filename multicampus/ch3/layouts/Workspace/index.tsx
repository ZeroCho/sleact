import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import useSocket from '@hooks/useSocket';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceButton,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import Channel from '@pages/Channel';
import DirectMessage from '@pages/DirectMessage';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect } from 'react';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import useSWR from 'swr';
import gravatar from 'gravatar';

const Workspace = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>('/api/user', fetcher);
  const { data: channelData } = useSWR<IChannel[]>(`/api/workspace/${workspace}/channels`, fetcher);
  const [socket, disconnectSocket] = useSocket(workspace);

  useEffect(() => {
    return () => {
      console.info('disconnect socket', workspace);
      disconnectSocket();
    };
  }, [workspace]);
  useEffect(() => {
    if (userData) {
      console.info('로그인하자');
      socket?.emit('login', { id: userData?.id, channels: [] });
    }
  }, [userData]);

  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span>
              <ProfileImg src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} />
            </span>
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton>+</AddButton>
        </Workspaces>

        <Channels>
          <WorkspaceName>{userData?.Workspaces.find((v) => v.url === workspace)?.name}</WorkspaceName>
          <MenuScroll>
            <ChannelList userData={userData} channelData={channelData} />
            <DMList userData={userData} />
          </MenuScroll>
        </Channels>

        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
