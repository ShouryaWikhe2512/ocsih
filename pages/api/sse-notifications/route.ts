import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Send initial connection event
      sendEvent({
        type: 'connection',
        data: { status: 'connected' },
        timestamp: new Date().toISOString()
      });

      // Send periodic mock notifications
      const interval = setInterval(() => {
        const notifications = [
          {
            type: 'new_incident',
            data: { message: 'New verified incident received' },
            timestamp: new Date().toISOString()
          },
          {
            type: 'dispatch_update',
            data: { message: 'Dispatch team status updated' },
            timestamp: new Date().toISOString()
          }
        ];

        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        sendEvent(randomNotification);
      }, 30000); // Every 30 seconds

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}