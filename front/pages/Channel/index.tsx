import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import axios from 'axios';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();
  const { data: chatData } = useSWR<Array<{ id: number, content: string }>>(`/api/workspace/${workspace}/channel/${channel}/chats`, fetcher);
  const [chat, onChangeChat] = useInput('');

  const onSubmitForm = useCallback(() => {
    if (chat?.trim()) {
      axios.post(`/api/channel/${channel}/chat`)
        .then(() => {

        })
        .catch(console.error);
    }
  }, [chat]);

  return (
    <div>
      <header>{channel}</header>
      <div>
        <form onSubmit={onSubmitForm}>
          <textarea value={chat} onChange={onChangeChat} />
          <button type="submit">전송</button>
        </form>
      </div>
    </div>
  )
}

export default Channel;
