import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const useChatSignalr = (activityId: string) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    if (connection !== null) {
      connection.stop();
    }

    const hubConnection = new HubConnectionBuilder()
      .withUrl(`http://localhost:5000/api/signalr/chat?activityId=${activityId}`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(hubConnection);

    return () => {
      hubConnection.stop().catch(e => console.error('Error closing signalr connection', e));
    };
  }, [activityId]);

  return connection;
};

export default useChatSignalr;
