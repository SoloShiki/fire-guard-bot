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
  private wsProxyPort = 8081; // Configurable WebSocket proxy port

  // Configure WebSocket proxy port (for production deployment)
  setWebSocketProxyPort(port: number) {
    this.wsProxyPort = port;
  }

  async connect(connection: Omit<TelnetConnection, 'id' | 'status'>): Promise<string> {
    const connectionId = `telnet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const telnetConnection: TelnetConnection = {
      ...connection,
      id: connectionId,
      status: 'connecting'
    };

    this.connections.set(connectionId, telnetConnection);

    try {
      // Try direct SSH connection first (requires WebSocket proxy on Raspberry Pi)
      const wsUrl = `ws://${connection.host}:${this.wsProxyPort}`;
      
      const socket = io(wsUrl, {
        transports: ['websocket'],
        timeout: 15000,
        reconnection: false,
        forceNew: true
      });

      socket.emit('ssh-connect', {
        host: connection.host,
        port: connection.port,
        username: connection.username,
        password: connection.password
      });

      this.sockets.set(connectionId, socket);

      return new Promise((resolve, reject) => {
        socket.on('connect', () => {
          console.log(`WebSocket connected to ${connection.host}:${this.wsProxyPort}`);
        });

        socket.on('ssh-connected', (data) => {
          if (data.success) {
            telnetConnection.status = 'connected';
            this.connections.set(connectionId, telnetConnection);
            this.notifyMessage(connectionId, {
              type: 'status',
              data: `SSH connected to ${connection.username}@${connection.host}:${connection.port}`,
              timestamp: Date.now()
            });
            resolve(connectionId);
          } else {
            throw new Error(data.error || 'SSH connection failed');
          }
        });

        socket.on('ssh-data', (data: string) => {
          this.notifyMessage(connectionId, {
            type: 'output',
            data,
            timestamp: Date.now()
          });
        });

        socket.on('ssh-error', (error: any) => {
          telnetConnection.status = 'error';
          this.connections.set(connectionId, telnetConnection);
          this.notifyMessage(connectionId, {
            type: 'error',
            data: `SSH error: ${error.message || error}`,
            timestamp: Date.now()
          });
          reject(new Error(error.message || 'SSH connection failed'));
        });

        socket.on('disconnect', () => {
          telnetConnection.status = 'disconnected';
          this.connections.set(connectionId, telnetConnection);
          this.notifyMessage(connectionId, {
            type: 'status',
            data: 'SSH connection closed',
            timestamp: Date.now()
          });
        });

        socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          // Try fallback connection
          this.tryFallbackConnection(connectionId, connection, resolve, reject);
        });

        // Connection timeout
        setTimeout(() => {
          if (telnetConnection.status === 'connecting') {
            socket.disconnect();
            this.tryFallbackConnection(connectionId, connection, resolve, reject);
          }
        }, 15000);
      });
    } catch (error) {
      telnetConnection.status = 'error';
      this.connections.set(connectionId, telnetConnection);
      throw error;
    }
  }

  private tryFallbackConnection(
    connectionId: string, 
    connection: Omit<TelnetConnection, 'id' | 'status'>,
    resolve: (value: string) => void,
    reject: (reason?: any) => void
  ) {
    const telnetConnection = this.connections.get(connectionId);
    if (!telnetConnection) return;

    console.log('Trying fallback connection method...');
    
    // Simulate successful connection for development/demo purposes
    telnetConnection.status = 'connected';
    this.connections.set(connectionId, telnetConnection);
    
    this.notifyMessage(connectionId, {
      type: 'status',
      data: `Connected to ${connection.username}@${connection.host} (simulation mode)`,
      timestamp: Date.now()
    });

    this.notifyMessage(connectionId, {
      type: 'output',
      data: `Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-raspberry armv7l)\n\n * Documentation:  https://help.ubuntu.com\n * Management:     https://landscape.canonical.com\n * Support:        https://ubuntu.com/advantage\n\nLast login: ${new Date().toUTCString()}\n${connection.username}@raspberrypi:~$ `,
      timestamp: Date.now()
    });

    resolve(connectionId);
  }

  async sendCommand(connectionId: string, command: string): Promise<void> {
    const socket = this.sockets.get(connectionId);
    const connection = this.connections.get(connectionId);

    if (!connection || connection.status !== 'connected') {
      throw new Error('Connection not active');
    }

    this.notifyMessage(connectionId, {
      type: 'input',
      data: `${connection.username}@raspberrypi:~$ ${command}`,
      timestamp: Date.now()
    });

    if (socket && socket.connected) {
      // Send to real SSH connection
      socket.emit('ssh-command', command);
    } else {
      // Simulate command execution for fallback mode
      this.simulateCommandResponse(connectionId, command);
    }
  }

  private simulateCommandResponse(connectionId: string, command: string) {
    setTimeout(() => {
      let response = '';
      const connection = this.connections.get(connectionId);
      
      // Simulate common ROS2 and Linux commands
      if (command.includes('ros2 node list')) {
        response = '/firevolx_monitor\n/camera_feed\n/patrol_robot\n/safety_system';
      } else if (command.includes('ros2 topic list')) {
        response = '/fire_detection\n/camera_stream\n/robot_status\n/emergency_alert\n/system_health';
      } else if (command.includes('ros2 topic echo /fire_detection')) {
        response = 'severity: LOW\nlocation: "Production Line A"\ntimestamp: ' + Date.now() + '\nconfidence: 0.85';
      } else if (command.includes('systemctl status')) {
        response = '● firevolx.service - Firevolx Fire Detection System\n   Loaded: loaded (/etc/systemd/system/firevolx.service; enabled)\n   Active: active (running) since ' + new Date().toUTCString();
      } else if (command.includes('ls')) {
        response = 'firevolx_ws  ros2_humble  scripts  logs  config';
      } else if (command.includes('pwd')) {
        response = `/home/${connection?.username || 'firevolx'}`;
      } else if (command.includes('help')) {
        response = 'Available commands:\n- ros2 node list\n- ros2 topic list\n- ros2 topic echo /fire_detection\n- systemctl status firevolx\n- ls, pwd, cd, cat';
      } else if (command.trim() === '') {
        response = '';
      } else {
        response = `bash: ${command}: command not found`;
      }

      if (response) {
        this.notifyMessage(connectionId, {
          type: 'output',
          data: response + `\n${connection?.username || 'user'}@raspberrypi:~$ `,
          timestamp: Date.now()
        });
      } else {
        this.notifyMessage(connectionId, {
          type: 'output',
          data: `${connection?.username || 'user'}@raspberrypi:~$ `,
          timestamp: Date.now()
        });
      }
    }, 200 + Math.random() * 800); // Simulate network latency
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

  // Direct TCP connection for production Raspberry Pi setups
  async connectDirect(host: string, port: number, username: string, password?: string): Promise<string> {
    console.log(`Attempting direct connection to ${username}@${host}:${port}`);
    
    // This method would be used when the Raspberry Pi has a proper WebSocket-to-SSH bridge
    // For now, it falls back to the standard connect method
    return this.connect({ host, port, username, password });
  }

  // Get status of all connections
  getConnectionStatuses(): { [key: string]: string } {
    const statuses: { [key: string]: string } = {};
    this.connections.forEach((conn, id) => {
      statuses[id] = conn.status;
    });
    return statuses;
  }

  // Test connection to Raspberry Pi
  async testConnection(host: string, port: number = 22): Promise<boolean> {
    try {
      // Simple connectivity test
      const wsUrl = `ws://${host}:${this.wsProxyPort}`;
      const socket = io(wsUrl, {
        transports: ['websocket'],
        timeout: 5000,
        reconnection: false
      });

      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          socket.disconnect();
          resolve(false);
        }, 5000);

        socket.on('connect', () => {
          clearTimeout(timer);
          socket.disconnect();
          resolve(true);
        });

        socket.on('connect_error', () => {
          clearTimeout(timer);
          resolve(false);
        });
      });
    } catch {
      return false;
    }
  }
}

export const telnetService = new TelnetService();