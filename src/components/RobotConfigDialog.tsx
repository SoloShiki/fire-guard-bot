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
    alertSensitivity: "medium",
    fireSensorEnabled: true,
    smokeSensorEnabled: true,
    motionDetection: true,
    audioAlerts: true,
    recordingEnabled: false,
    autoReboot: true,
    updateInterval: "5"
  });
  const { toast } = useToast();

  const handleSave = () => {
    // Save to localStorage
    const savedConfigs = JSON.parse(localStorage.getItem('robotConfigs') || '{}');
    savedConfigs[robot.id] = config;
    localStorage.setItem('robotConfigs', JSON.stringify(savedConfigs));
    
    onSave(robot.id, config);
    onOpenChange(false);
    
    toast({
      title: "Configuration Saved",
      description: `Settings for ${robot.name} have been updated`,
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
            <Label htmlFor="sensitivity">Alert Sensitivity</Label>
            <Select value={config.alertSensitivity} onValueChange={(value) => setConfig({...config, alertSensitivity: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Less sensitive</SelectItem>
                <SelectItem value="medium">Medium - Standard</SelectItem>
                <SelectItem value="high">High - Very sensitive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Fire Detection</Label>
                <p className="text-xs text-muted-foreground">Enable fire sensor monitoring</p>
              </div>
              <Switch 
                checked={config.fireSensorEnabled} 
                onCheckedChange={(checked) => setConfig({...config, fireSensorEnabled: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Smoke Detection</Label>
                <p className="text-xs text-muted-foreground">Enable smoke sensor monitoring</p>
              </div>
              <Switch 
                checked={config.smokeSensorEnabled} 
                onCheckedChange={(checked) => setConfig({...config, smokeSensorEnabled: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Motion Detection</Label>
                <p className="text-xs text-muted-foreground">Detect unusual movement patterns</p>
              </div>
              <Switch 
                checked={config.motionDetection} 
                onCheckedChange={(checked) => setConfig({...config, motionDetection: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Audio Alerts</Label>
                <p className="text-xs text-muted-foreground">Play sound on robot when alert triggered</p>
              </div>
              <Switch 
                checked={config.audioAlerts} 
                onCheckedChange={(checked) => setConfig({...config, audioAlerts: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Recording</Label>
                <p className="text-xs text-muted-foreground">Save video recordings during alerts</p>
              </div>
              <Switch 
                checked={config.recordingEnabled} 
                onCheckedChange={(checked) => setConfig({...config, recordingEnabled: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Reboot</Label>
                <p className="text-xs text-muted-foreground">Daily automatic restart at 3:00 AM</p>
              </div>
              <Switch 
                checked={config.autoReboot} 
                onCheckedChange={(checked) => setConfig({...config, autoReboot: checked})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="update-interval">Update Interval (seconds)</Label>
            <Input 
              id="update-interval"
              type="number"
              min="1"
              max="60"
              value={config.updateInterval}
              onChange={(e) => setConfig({...config, updateInterval: e.target.value})}
              className="mt-1"
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