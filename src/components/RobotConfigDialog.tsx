import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Robot {
  id: string;
  name: string;
  status: "online" | "offline";
  signalStrength: number;
  location: string;
  ipAddress: string;
}

interface RobotConfigDialogProps {
  robot: Robot;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (robotId: string, config: any) => void;
}

export const RobotConfigDialog = ({ robot, isOpen, onOpenChange, onSave }: RobotConfigDialogProps) => {
  const [config, setConfig] = useState({
    id: robot.id,
    name: robot.name,
    location: robot.location,
    wifiNetwork: "",
    wifiPassword: ""
  });
  const { toast } = useToast();

  const handleSave = () => {
    // Save to localStorage
    const savedRobots = JSON.parse(localStorage.getItem('robots') || '[]');
    const updatedRobots = savedRobots.map((r: any) => 
      r.id === robot.id ? { ...r, ...config } : r
    );
    localStorage.setItem('robots', JSON.stringify(updatedRobots));
    
    onSave(robot.id, config);
    onOpenChange(false);
    
    toast({
      title: "Configuration Saved",
      description: `Settings for ${config.name} have been updated`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure {robot.name}</DialogTitle>
          <DialogDescription>
            Adjust detection settings and behavior for this robot
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="robotId">Robot ID</Label>
            <Input
              id="robotId"
              value={config.id}
              onChange={(e) => setConfig({...config, id: e.target.value})}
              className="mt-1"
              placeholder="Enter robot ID"
            />
          </div>

          <div>
            <Label htmlFor="robotName">Robot Name</Label>
            <Input
              id="robotName"
              value={config.name}
              onChange={(e) => setConfig({...config, name: e.target.value})}
              className="mt-1"
              placeholder="Enter robot name"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={config.location}
              onChange={(e) => setConfig({...config, location: e.target.value})}
              className="mt-1"
              placeholder="Enter location"
            />
          </div>

          <div>
            <Label htmlFor="wifiNetwork">WiFi Network</Label>
            <Input
              id="wifiNetwork"
              value={config.wifiNetwork}
              onChange={(e) => setConfig({...config, wifiNetwork: e.target.value})}
              className="mt-1"
              placeholder="Enter WiFi network name"
            />
          </div>

          <div>
            <Label htmlFor="wifiPassword">WiFi Password</Label>
            <Input
              id="wifiPassword"
              type="password"
              value={config.wifiPassword}
              onChange={(e) => setConfig({...config, wifiPassword: e.target.value})}
              className="mt-1"
              placeholder="Enter WiFi password"
            />
          </div>

          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};