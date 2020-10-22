import useSocket from '@hooks/useSocket';
import { CollapseButton } from '@layouts/Workspace/styles';
import { IChannel, IChat } from '@typings/db';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

interface Props {
  channelData?: IChannel[];
}

const ChannelList: FC<Props> = ({ channelData }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

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

  useEffect(() => {
    console.log('workspace 바꼈다', workspace);
    setCountList({});
  }, [workspace]);

  useEffect(() => {
    socket?.on('message', (data: IChat) => {
      console.log('message왔다', data);
      setCountList((list) => {
        return {
          ...list,
          [`c-${data.ChannelId}`]: 1,
        };
      });
    });
    return () => {
      socket?.off('message');
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
            console.log('channel', channel);
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
    </>
  );
};

export default ChannelList;
