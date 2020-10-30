import useSocket from '@hooks/useSocket';
import { CollapseButton } from '@components/DMList/styles';
import { IChannel, IChat, IUser } from '@typings/db';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

interface Props {
  channelData?: IChannel[];
  userData?: IUser;
}

const ChannelList: FC<Props> = ({ userData, channelData }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number | undefined }>({});

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const resetCount = useCallback(
    (id) => () => {
      setCountList((list) => {
        return {
          ...list,
          [id]: undefined,
        };
      });
    },
    [],
  );

  useEffect(() => {
    console.log('ChannelList: workspace 바꼈다', workspace, location.pathname);
    setCountList({});
  }, [workspace, location]);

  const onMessage = (data: IChat) => {
    console.log('message 왔다', data);
    const mentions: string[] | null = data.content.match(/@\[(.+?)]\((\d)\)/g);
    if (mentions?.find((v) => v.match(/@\[(.+?)]\((\d)\)/)![2] === userData?.id.toString())) {
      return setCountList((list) => {
        return {
          ...list,
          [`c-${data.ChannelId}`]: (list[`c-${data.ChannelId}`] || 0) + 1,
        };
      });
    }
    setCountList((list) => {
      return {
        ...list,
        [`c-${data.ChannelId}`]: list[`c-${data.ChannelId}`] || 0,
      };
    });
  };

  useEffect(() => {
    socket?.on('message', onMessage);
    console.log('socket on message', socket?.hasListeners('message'));
    return () => {
      socket?.off('message', onMessage);
      console.log('socket off message', socket?.hasListeners('message'));
    };
  }, [socket]);

  return (
    <>
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
            const count = countList[`c-${channel.id}`];
            return (
              <NavLink
                key={channel.name}
                activeClassName="selected"
                to={`/workspace/${workspace}/channel/${channel.name}`}
                onClick={resetCount(`c-${channel.id}`)}
              >
                <span className={count !== undefined && count >= 0 ? 'bold' : undefined}># {channel.name}</span>
                {count !== undefined && count > 0 && <span className="count">{count}</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default ChannelList;
