/**
 * ROS 2 Communication Service for Raspberry Pi Integration
 * Based on WebSocket bridge pattern for real-time ROS 2 communication
 */

interface ROS2Message {
  topic: string;
  data: any;
  timestamp: number;
}

interface EmergencyAlert {
  type: 'fire_detected' | 'unsafe_condition' | 'equipment_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  robotId: string;
  description: string;
  timestamp: number;
}

class ROS2Service {
  private websocket: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private emergencyCallbacks: ((alert: EmergencyAlert) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // In production, this would connect to your ROS 2 WebSocket bridge
      // For now, we'll simulate the connection
      this.simulateConnection();
    } catch (error) {
      console.error('Failed to connect to ROS 2 bridge:', error);
      this.handleReconnect();
    }
  }

  private simulateConnection() {
    // Simulate WebSocket connection to ROS 2 bridge
    this.isConnected = true;
    console.log('Connected to ROS 2 WebSocket bridge');
    
    // Simulate incoming emergency alerts
    this.simulateEmergencyAlerts();
  }

  private simulateEmergencyAlerts() {
    // Simulate random emergency alerts for demonstration
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const alerts: EmergencyAlert[] = [
          {
            type: 'unsafe_condition',
            severity: 'high',
            location: 'Production Floor A',
            robotId: 'RBT-001',
            description: 'Person detected holding cigarette near equipment',
            timestamp: Date.now()
          },
          {
            type: 'fire_detected',
            severity: 'critical',
            location: 'Storage Area B',
            robotId: 'RBT-002',
            description: 'Smoke and heat signatures detected',
            timestamp: Date.now()
          }
        ];
        
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        this.notifyEmergencyCallbacks(randomAlert);
      }
    }, 30000);
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, 5000 * this.reconnectAttempts);
    }
  }

  private notifyEmergencyCallbacks(alert: EmergencyAlert) {
    this.emergencyCallbacks.forEach(callback => callback(alert));
  }

  public sendCommand(robotId: string, command: string, params?: any) {
    if (!this.isConnected) {
      console.error('Not connected to ROS 2 bridge');
      return false;
    }

    const message: ROS2Message = {
      topic: `/robot/${robotId}/cmd`,
      data: { command, params },
      timestamp: Date.now()
    };

    // In production, send via WebSocket
    console.log('Sending ROS 2 command:', message);
    return true;
  }

  public subscribeToEmergencyAlerts(callback: (alert: EmergencyAlert) => void) {
    this.emergencyCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.emergencyCallbacks = this.emergencyCallbacks.filter(cb => cb !== callback);
    };
  }

  public getRobotStatus(robotId: string): Promise<any> {
    return new Promise((resolve) => {
      // Simulate ROS 2 service call
      setTimeout(() => {
        resolve({
          robotId,
          battery: Math.floor(Math.random() * 30) + 70,
          location: 'Production Floor',
          sensors: {
            temperature: 22.5,
            humidity: 45,
            smoke: false,
            motion: true
          },
          lastHeartbeat: Date.now()
        });
      }, 500);
    });
  }

  public disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.isConnected = false;
  }
}

export const ros2Service = new ROS2Service();
export type { EmergencyAlert, ROS2Message };