import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const useSignalr = (url?: string) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionUrl, setConnectionUrl] = useState('');

  useEffect(() => {
    if (!connectionUrl) {
      return;
    }

    if (connection !== null) {
      connection.stop();
    }

    const hubConnection = new HubConnectionBuilder()
      .withUrl(`${process.env.API_URL}/signalr/${connectionUrl}`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(hubConnection);

    return () => {
      hubConnection.stop().catch(e => console.error('Error closing signalr connection', e));
    };
  }, [connectionUrl]);

  useEffect(() => {
    if (url) {
      setConnectionUrl(url);
    }
  }, [url]);

  return {
    connection,
    setUrl: setConnectionUrl,
  };
};

export default useSignalr;
