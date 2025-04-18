import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { db } from '../config/firebase';

interface Client {
  userId: string;
  ws: WebSocket;
}

interface NoteData {
  userId: string;
  [key: string]: any;
}

interface WebSocketMessage {
  type: string;
  userId?: string;
  [key: string]: any;
}

class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, Client[]> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket) => {
      let userId: string | null = null;

      // FIX: Xác định kiểu dữ liệu cho message từ WebSocket
      ws.on('message', async (messageBuffer: Buffer) => {
        try {
          // FIX: Chuyển Buffer thành string trước khi parse JSON
          const messageString = messageBuffer.toString();
          const data = JSON.parse(messageString) as WebSocketMessage;

          if (data.type === 'auth' && typeof data.userId === 'string') {
            userId = data.userId;
            this.addClient(userId, ws);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        if (userId) {
          this.removeClient(userId, ws);
        }
      });
    });

    // Set up Firestore listeners for real-time updates
    this.setupFirestoreListeners();
  }

  private addClient(userId: string, ws: WebSocket) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    
    const clientList = this.clients.get(userId);
    if (clientList) {
      clientList.push({ userId, ws });
    }
  }

  private removeClient(userId: string, ws: WebSocket) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const index = userClients.findIndex(client => client.ws === ws);
      if (index !== -1) {
        userClients.splice(index, 1);
      }
      if (userClients.length === 0) {
        this.clients.delete(userId);
      }
    }
  }

  private setupFirestoreListeners() {
    // Listen for note changes
    db.collection('notes').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        // FIX: Xác định kiểu dữ liệu cho note và thêm kiểm tra tồn tại
        const noteData = change.doc.data() as NoteData | undefined;
        
        if (noteData && noteData.userId) {
          const userClients = this.clients.get(noteData.userId);
          if (userClients) {
            const message = JSON.stringify({
              type: 'noteUpdate',
              action: change.type,
              noteId: change.doc.id,
              data: noteData
            });

            userClients.forEach(client => {
              if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(message);
              }
            });
          }
        }
      });
    });
  }

  // Method to broadcast a message to all clients of a specific user
  public broadcastToUser(userId: string, message: any) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const messageStr = JSON.stringify(message);
      userClients.forEach(client => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(messageStr);
        }
      });
    }
  }
}

export default WebSocketService;
