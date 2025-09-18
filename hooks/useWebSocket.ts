import { useEffect, useRef } from 'react';
import { MockWebSocket } from '@/lib/ws-mock';

export const useWebSocket = (onMessage: (data: any) => void) => {
  const wsRef = useRef<MockWebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new MockWebSocket();
    wsRef.current.on('message', onMessage);
    wsRef.current.connect();

    return () => {
      wsRef.current?.disconnect();
    };
  }, [onMessage]);

  return wsRef.current;
};