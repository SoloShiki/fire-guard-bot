import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wifi, Plus, Settings, Trash2, Signal } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RobotConfigDialog } from "./RobotConfigDialog";


interface Robot {
  id: string;
  name: string;
  status: "online" | "offline";
  batteryLevel: number;
  lastContact: string;
  location: string;
  ipAddress: string;
  signalStrength: number;
}

const mockRobots: Robot[] = [
  {
    id: "RBT-001",
    name: "Fire Detection Unit 1",
    status: "online",
    batteryLevel: 85,
    lastContact: "2 minutes ago",
    location: "Production Floor A",
    ipAddress: "192.168.1.101",
    signalStrength: 85
  },
  {
    id: "RBT-002", 
    name: "Safety Monitor Unit 2",
    status: "online",
    batteryLevel: 92,
    lastContact: "1 minute ago",
    location: "Processing Plant C",
    ipAddress: "192.168.1.102",
    signalStrength: 92
  },
  {
    id: "RBT-003",
    name: "Patrol Robot Unit 3",
    status: "online",
    batteryLevel: 78,
    lastContact: "3 minutes ago",
    location: "Storage Area B",
    ipAddress: "192.168.1.103",
    signalStrength: 78
  }
];

export const RobotManagement = () => {
  const [robots, setRobots] = useState<Robot[]>(mockRobots);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [robotId, setRobotId] = useState("");
  const [robotName, setRobotName] = useState("");
  const [location, setLocation] = useState("");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const { toast } = useToast();

  const getSignalIcon = (strength: number) => {
    if (strength > 75) return <Signal className="text-success" size={16} />;
    if (strength > 50) return <Signal className="text-warning" size={16} />;
    if (strength > 25) return <Signal className="text-emergency" size={16} />;
    return <Signal className="text-muted-foreground" size={16} />;
  };

  const getStatusColor = (status: string) => {
    return status === "online" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground";
  };

  const handleConnectRobot = () => {
    if (!robotId || !robotName || !location || !wifiSSID || !wifiPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newRobot: Robot = {
      id: robotId,
      name: robotName,
      status: "online",
      batteryLevel: Math.floor(Math.random() * 30) + 70,
      lastContact: "Just connected",
      location: location,
      ipAddress: `192.168.1.${100 + robots.length + 1}`,
      signalStrength: Math.floor(Math.random() * 30) + 70,
    };

    setRobots([...robots, newRobot]);
    
    // Reset form
    setRobotId("");
    setRobotName("");
    setLocation("");
    setWifiSSID("");
    setWifiPassword("");
    setIsAddDialogOpen(false);
    
    toast({
      title: "Robot Connected",
      description: `${robotName} has been successfully connected to the cloud`,
    });
  };

  const handleRemoveRobot = (robotId: string, robotName: string) => {
    setRobots(robots.filter(robot => robot.id !== robotId));
    toast({
      title: "Robot Removed",
      description: `${robotName} has been disconnected`,
    });
  };

  const handleConfigureRobot = (robot: Robot) => {
    setSelectedRobot(robot);
    setIsConfigDialogOpen(true);
  };

  const handleSaveRobotConfig = (robotId: string, config: any) => {
    // Save to localStorage
    const savedConfigs = JSON.parse(localStorage.getItem('robotConfigs') || '{}');
    savedConfigs[robotId] = config;
    localStorage.setItem('robotConfigs', JSON.stringify(savedConfigs));
    
    // Update robot in the list if needed
    setRobots(robots.map(robot => 
      robot.id === robotId 
        ? { ...robot, ...config }
        : robot
    ));
    
    toast({
      title: "Configuration Saved",
      description: `Settings for robot ${robotId} have been updated`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Robot Management</h3>
          <p className="text-sm text-muted-foreground">Manage your connected Firevolx robots</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={16} className="mr-2" />
              Add Robot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect New Robot</DialogTitle>
              <DialogDescription>
                Enter the robot details to establish a WiFi connection to the cloud
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="robot-id">Robot ID</Label>
                <Input 
                  id="robot-id" 
                  placeholder="RBT-004"
                  value={robotId}
                  onChange={(e) => setRobotId(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="robot-name">Robot Name</Label>
                <Input 
                  id="robot-name" 
                  placeholder="Safety Monitor Delta"
                  value={robotName}
                  onChange={(e) => setRobotName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Warehouse Section D"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="wifi-ssid">WiFi Network</Label>
                <Input 
                  id="wifi-ssid" 
                  placeholder="Factory-WiFi"
                  value={wifiSSID}
                  onChange={(e) => setWifiSSID(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="wifi-password">WiFi Password</Label>
                <Input 
                  id="wifi-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleConnectRobot}
              >
                <Wifi size={16} className="mr-2" />
                Connect Robot
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {robots.map((robot) => (
          <Card key={robot.id} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Wifi className="text-primary" size={20} />
                  <div>
                    <CardTitle className="text-base text-foreground">{robot.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{robot.location}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(robot.status)}>
                    {robot.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Battery:</span>
                  <span className="text-foreground font-medium">{robot.batteryLevel}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Signal:</span>
                  {getSignalIcon(robot.signalStrength)}
                  <span className="text-foreground font-medium">{robot.signalStrength}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Contact:</span>
                  <span className="ml-2 text-foreground font-medium">{robot.lastContact}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">IP:</span>
                  <span className="ml-2 text-foreground font-medium">{robot.ipAddress}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleConfigureRobot(robot)}
                >
                  <Settings size={14} className="mr-1" />
                  Configure
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-emergency border-emergency hover:bg-emergency hover:text-emergency-foreground"
                  onClick={() => handleRemoveRobot(robot.id, robot.name)}
                >
                  <Trash2 size={14} className="mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedRobot && (
        <RobotConfigDialog
          robot={selectedRobot}
          isOpen={isConfigDialogOpen}
          onOpenChange={setIsConfigDialogOpen}
          onSave={handleSaveRobotConfig}
        />
      )}
    </div>
  );
};