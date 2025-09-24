import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Power, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";

interface TerminalComponentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TerminalComponent = ({ isOpen, onOpenChange }: TerminalComponentProps) => {
  const [selectedRobot, setSelectedRobot] = useState("");
  const [connected, setConnected] = useState(false);
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const { toast } = useToast();
  const { settings } = useSettings();

  // Available robots from settings
  const robots = settings.robots;

  useEffect(() => {
    // Auto scroll to bottom when output changes
    const timer = setTimeout(() => {
      const terminalElement = document.querySelector('.terminal-output');
      if (terminalElement) {
        terminalElement.scrollTop = terminalElement.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [output]);

  const connectToRobot = async () => {
    if (!selectedRobot) {
      toast({
        title: "No Robot Selected",
        description: "Please select a robot to connect to",
        variant: "destructive"
      });
      return;
    }

    setConnectionStatus("connecting");
    setOutput(prev => [...prev, `Connecting to ${selectedRobot}...`]);

    try {
      // Simulate SSH connection - In real implementation, this would use SSH over WebSocket
      const robot = robots.find((r: any) => r.id === selectedRobot);
      if (robot) {
        // Simulated connection delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setConnectionStatus("connected");
        setConnected(true);
        setOutput(prev => [
          ...prev,
          `Connected to ${robot.name} (${robot.ipAddress || '192.168.1.100'})`,
          `Ubuntu 22.04.3 LTS`,
          `Welcome to ROS 2 Humble`,
          `firevolx@${robot.name.toLowerCase().replace(/\s+/g, '-')}:~$ `
        ]);

        toast({
          title: "Connected",
          description: `Successfully connected to ${robot.name}`,
        });
      }
    } catch (error) {
      setConnectionStatus("disconnected");
      setOutput(prev => [...prev, `Connection failed: ${error}`]);
      toast({
        title: "Connection Failed",
        description: "Could not establish connection to robot",
        variant: "destructive"
      });
    }
  };

  const disconnectFromRobot = () => {
    setConnected(false);
    setConnectionStatus("disconnected");
    setOutput(prev => [...prev, "Connection closed."]);
    toast({
      title: "Disconnected",
      description: "Terminal session ended",
    });
  };

  const executeCommand = async () => {
    if (!command.trim() || !connected) return;

    const currentCommand = command;
    setCommand("");
    setOutput(prev => [...prev, `firevolx@robot:~$ ${currentCommand}`]);

    // Simulate command execution
    setTimeout(() => {
      let response = "";
      
      switch (currentCommand.toLowerCase()) {
        case "ros2 node list":
          response = "/fire_detection_node\n/camera_publisher\n/alert_system\n/patrol_controller";
          break;
        case "ros2 topic list":
          response = "/fire_alert\n/camera_stream\n/robot_status\n/emergency_stop\n/patrol_waypoints";
          break;
        case "ros2 topic echo /fire_alert":
          response = "data: Fire detected in sector A3\ntimestamp: 1703764800\nseverity: HIGH";
          break;
        case "ros2 service list":
          response = "/emergency_stop\n/set_patrol_route\n/configure_sensors\n/get_robot_status";
          break;
        case "systemctl status ros2-firevolx":
          response = "● ros2-firevolx.service - Firevolx Detection System\n   Loaded: loaded\n   Active: active (running)";
          break;
        case "ls":
          response = "firevolx_ws  logs  config  scripts";
          break;
        case "pwd":
          response = "/home/firevolx";
          break;
        case "whoami":
          response = "firevolx";
          break;
        case "date":
          response = new Date().toString();
          break;
        case "help":
          response = "Available ROS 2 commands:\n- ros2 node list\n- ros2 topic list\n- ros2 topic echo /topic_name\n- ros2 service list\n- systemctl status ros2-firevolx";
          break;
        default:
          if (currentCommand.startsWith("ros2")) {
            response = "Command executed. Check robot logs for details.";
          } else {
            response = `bash: ${currentCommand}: command not found`;
          }
      }
      
      setOutput(prev => [...prev, response]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="h-5 w-5" />
              <CardTitle>Robot Terminal</CardTitle>
              <div className={`flex items-center space-x-1 text-sm ${
                connectionStatus === "connected" ? "text-green-500" : 
                connectionStatus === "connecting" ? "text-yellow-500" : "text-red-500"
              }`}>
                <Wifi className="h-4 w-4" />
                <span className="capitalize">{connectionStatus}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <Select value={selectedRobot} onValueChange={setSelectedRobot} disabled={connected}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select robot" />
              </SelectTrigger>
              <SelectContent>
                {robots.map((robot: any) => (
                  <SelectItem key={robot.id} value={robot.id}>
                    {robot.name} - {robot.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {!connected ? (
              <Button 
                onClick={connectToRobot} 
                disabled={!selectedRobot || connectionStatus === "connecting"}
                size="sm"
              >
                <Power className="h-4 w-4 mr-1" />
                Connect
              </Button>
            ) : (
              <Button onClick={disconnectFromRobot} variant="destructive" size="sm">
                <Power className="h-4 w-4 mr-1" />
                Disconnect
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 h-full border rounded p-4 bg-black text-green-400 font-mono text-sm terminal-output">
            <div className="space-y-1">
              {output.length === 0 && (
                <div className="text-muted-foreground">
                  Select a robot and click Connect to start terminal session...
                </div>
              )}
              {output.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap break-all">
                  {line}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-sm text-muted-foreground font-mono">$</span>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={connected ? "Enter ROS 2 command..." : "Not connected"}
              disabled={!connected}
              className="font-mono"
            />
            <Button onClick={executeCommand} disabled={!connected || !command.trim()} size="sm">
              Execute
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Try: <code>ros2 node list</code>, <code>ros2 topic list</code>, <code>help</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};