import { ChatWrapper } from '@components/Chat/styles';
import { IChat, IDM, IUser } from '@typings/db';
import dayjs from 'dayjs';
import gravatar from 'gravatar';
import React, { FC, useMemo, memo } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import regexifyString from 'regexify-string';

interface Props {
  data: IDM | IChat;
}

const Chat: FC<Props> = memo(({ data }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const user: IUser = 'Sender' in data ? data.Sender : data.User;

  const result = useMemo<(string | JSX.Element)[]>(
    () =>
      regexifyString({
        pattern: /@\[(.+?)\]\((\d+?)\)|\n/g,
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)\]\((\d+?)\)/)!;
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }
          return <br key={index} />;
        },
        input: data.content,
      }),
    [data.content],
  );
  return (
    <ChatWrapper>
      <div>
        <img src={gravatar.url(user.email, { s: '36px' })} alt={user.nickname} />
      </div>
      <div style={{ flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flex: '0 0 100%', alignItems: 'center' }}>
          <b style={{ marginRight: 5 }}>{user.nickname}</b>
          <span style={{ fontSize: 12 }}>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p style={{ flex: '0 0 100%', margin: 0 }}>{result}</p>
      </div>
    </ChatWrapper>
  );
});

export default Chat;
