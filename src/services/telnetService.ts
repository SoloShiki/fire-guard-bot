import { io, Socket } from 'socket.io-client';

export interface TelnetConnection {
  id: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface TelnetMessage {
  type: 'output' | 'input' | 'error' | 'status';
  data: string;
  timestamp: number;
}

class TelnetService {
  private connections: Map<string, TelnetConnection> = new Map();
  private sockets: Map<string, Socket> = new Map();
  private messageHandlers: Map<string, (message: TelnetMessage) => void> = new Map();

  async connect(connection: Omit<TelnetConnection, 'id' | 'status'>): Promise<string> {
    const connectionId = `telnet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const telnetConnection: TelnetConnection = {
      ...connection,
      id: connectionId,
      status: 'connecting'
    };

    this.connections.set(connectionId, telnetConnection);

    try {
        const socket = io(`ws://${connection.host}:8081`, {
          transports: ['websocket'],
          timeout: 10000
        });

        socket.emit('connect-telnet', {
          host: connection.host,
          port: connection.port,
          username: connection.username,
          password: connection.password
        });

      this.sockets.set(connectionId, socket);

      return new Promise((resolve, reject) => {
        socket.on('connected', (data) => {
          if (data.success) {
            telnetConnection.status = 'connected';
            this.connections.set(connectionId, telnetConnection);
            this.notifyMessage(connectionId, {
              type: 'status',
              data: `Connected to ${connection.host}:${connection.port}`,
              timestamp: Date.now()
            });
            resolve(connectionId);
          }
        });

        socket.on('disconnected', () => {
          telnetConnection.status = 'disconnected';
          this.connections.set(connectionId, telnetConnection);
          this.notifyMessage(connectionId, {
            type: 'status',
            data: 'Connection closed',
            timestamp: Date.now()
          });
        });

        socket.on('data', (data: string) => {
          this.notifyMessage(connectionId, {
            type: 'output',
            data,
            timestamp: Date.now()
          });
        });

        socket.on('error', (error: any) => {
          telnetConnection.status = 'error';
          this.connections.set(connectionId, telnetConnection);
          this.notifyMessage(connectionId, {
            type: 'error',
            data: `Connection error: ${error.message || error}`,
            timestamp: Date.now()
          });
          reject(new Error(error.message || 'Connection failed'));
        });

        // Timeout handling
        setTimeout(() => {
          if (telnetConnection.status === 'connecting') {
            telnetConnection.status = 'error';
            this.connections.set(connectionId, telnetConnection);
            socket.disconnect();
            reject(new Error('Connection timeout'));
          }
        }, 10000);
      });
    } catch (error) {
      telnetConnection.status = 'error';
      this.connections.set(connectionId, telnetConnection);
      throw error;
    }
  }

  async sendCommand(connectionId: string, command: string): Promise<void> {
    const socket = this.sockets.get(connectionId);
    const connection = this.connections.get(connectionId);

    if (!socket || !connection || connection.status !== 'connected') {
      throw new Error('Connection not active');
    }

    this.notifyMessage(connectionId, {
      type: 'input',
      data: command,
      timestamp: Date.now()
    });

    socket.emit('command', command);
  }

  disconnect(connectionId: string): void {
    const socket = this.sockets.get(connectionId);
    const connection = this.connections.get(connectionId);

    if (socket) {
      socket.disconnect();
      this.sockets.delete(connectionId);
    }

    if (connection) {
      connection.status = 'disconnected';
      this.connections.set(connectionId, connection);
    }
  }

  getConnection(connectionId: string): TelnetConnection | undefined {
    return this.connections.get(connectionId);
  }

  onMessage(connectionId: string, handler: (message: TelnetMessage) => void): void {
    this.messageHandlers.set(connectionId, handler);
  }

  removeMessageHandler(connectionId: string): void {
    this.messageHandlers.delete(connectionId);
  }

  private notifyMessage(connectionId: string, message: TelnetMessage): void {
    const handler = this.messageHandlers.get(connectionId);
    if (handler) {
      handler(message);
    }
  }

  // Direct TCP connection fallback for modern browsers
  async connectDirect(host: string, port: number, username: string, password?: string): Promise<string> {
    const connectionId = `direct-${Date.now()}`;
    
    try {
      // Use Web TCP API if available (experimental)
      if ('navigator' in globalThis && 'connect' in navigator) {
        const transport = await (navigator as any).connect({ 
          hostname: host, 
          port 
        });
        
        const connection: TelnetConnection = {
          id: connectionId,
          host,
          port,
          username,
          password,
          status: 'connected'
        };
        
        this.connections.set(connectionId, connection);
        return connectionId;
      }
      
      throw new Error('Direct TCP not supported in this browser');
    } catch (error) {
      // Fallback to WebSocket proxy
      return this.connect({ host, port, username, password });
    }
  }
}

export const telnetService = new TelnetService();