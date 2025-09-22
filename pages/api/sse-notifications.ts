import { NextApiRequest, NextApiResponse } from 'next';

// Global store for SSE notifications
declare global {
  var sseNotifications: any[];
  var sseClients: Set<any>;
}

if (typeof global !== 'undefined') {
  if (!global.sseNotifications) {
    global.sseNotifications = [];
  }
  if (!global.sseClients) {
    global.sseClients = new Set();
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial connection event
  sendEvent({
    type: 'connection',
    data: { status: 'connected' },
    timestamp: new Date().toISOString()
  });

  // Send any pending notifications
  if (global.sseNotifications && global.sseNotifications.length > 0) {
    global.sseNotifications.forEach(notification => {
      sendEvent(notification);
    });
    // Clear sent notifications
    global.sseNotifications = [];
  }

  // Send periodic mock notifications (reduced frequency)
  const interval = setInterval(() => {
    const notifications = [
      {
        type: 'system_alert',
        data: { message: 'System status: All systems operational' },
        timestamp: new Date().toISOString()
      }
    ];

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    sendEvent(randomNotification);
  }, 300000); // Every 5 minutes instead of 30 seconds

  // Add client to global set
  global.sseClients.add(res);

  // Cleanup on close
  req.on('close', () => {
    clearInterval(interval);
    global.sseClients.delete(res);
  });
}

// Function to broadcast notifications to all connected clients
export function broadcastNotification(notification: any) {
  if (global.sseClients) {
    const message = `data: ${JSON.stringify(notification)}\n\n`;
    
    global.sseClients.forEach((res: any) => {
      try {
        res.write(message);
      } catch (error) {
        // Remove disconnected clients
        global.sseClients.delete(res);
      }
    });
  }
}