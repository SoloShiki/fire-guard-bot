import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Flame, Wrench, Zap } from "lucide-react";

const mockAlerts = [
  {
    id: "ALT-001",
    type: "fire",
    title: "Fire Detected",
    description: "High temperature detected in Processing Plant C",
    timestamp: "2024-01-15 14:32:15",
    robotId: "RBT-004",
    severity: "critical",
    status: "active"
  },
  {
    id: "ALT-002", 
    type: "safety",
    title: "Unsafe Condition",
    description: "Worker without safety equipment detected",
    timestamp: "2024-01-15 12:15:22",
    robotId: "RBT-001",
    severity: "high",
    status: "resolved"
  },
  {
    id: "ALT-003",
    type: "equipment",
    title: "Equipment Malfunction",
    description: "Conveyor belt motor overheating",
    timestamp: "2024-01-15 09:45:10",
    robotId: "RBT-002",
    severity: "medium",
    status: "resolved"
  },
  {
    id: "ALT-004",
    type: "electrical",
    title: "Power Anomaly",
    description: "Voltage fluctuation detected",
    timestamp: "2024-01-14 16:20:30",
    robotId: "RBT-003",
    severity: "low",
    status: "resolved"
  }
];

const AlertsHistory = () => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "fire":
        return <Flame className="text-emergency" size={20} />;
      case "safety":
        return <AlertTriangle className="text-warning" size={20} />;
      case "equipment":
        return <Wrench className="text-warning" size={20} />;
      case "electrical":
        return <Zap className="text-warning" size={20} />;
      default:
        return <AlertTriangle className="text-muted-foreground" size={20} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-emergency text-emergency-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-status-standby text-black";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emergency text-emergency-foreground";
      case "resolved":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Alert History</h1>
          <p className="text-muted-foreground">Recent safety alerts and incidents</p>
        </div>

        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <Card key={alert.id} className="p-4 border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground">Robot ID: {alert.robotId}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(alert.status)}>
                    {alert.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <p className="text-foreground mb-3">{alert.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">ID: {alert.id}</span>
                <span className="text-muted-foreground">{alert.timestamp}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AlertsHistory;