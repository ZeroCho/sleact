import io from 'socket.io-client';

const backUrl = process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3095';

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
    console.info('create socket', workspace, sockets[workspace].id);
  }
  function disconnect() {
    if (workspace && sockets[workspace]) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }
  return [sockets[workspace], disconnect];
};

export default useSocket;
