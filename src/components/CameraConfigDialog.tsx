import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CameraStream {
  id: string;
  name: string;
  url: string;
  status: "active" | "offline";
  robotId: string;
}

interface CameraConfigDialogProps {
  stream: CameraStream;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (streamId: string, config: any) => void;
}

export const CameraConfigDialog = ({ stream, isOpen, onOpenChange, onSave }: CameraConfigDialogProps) => {
  const [config, setConfig] = useState({
    name: stream.name,
    url: stream.url,
    robotId: stream.robotId
  });
  const { toast } = useToast();

  const handleSave = () => {
    // Save to localStorage
    const savedStreams = JSON.parse(localStorage.getItem('cameraStreams') || '[]');
    const updatedStreams = savedStreams.map((s: any) => 
      s.id === stream.id ? { ...s, ...config } : s
    );
    localStorage.setItem('cameraStreams', JSON.stringify(updatedStreams));
    
    onSave(stream.id, config);
    onOpenChange(false);
    
    toast({
      title: "Camera Configuration Saved",
      description: `Settings for ${config.name} have been updated`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure {stream.name}</DialogTitle>
          <DialogDescription>
            Adjust camera settings and streaming options
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Stream Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig({...config, name: e.target.value})}
              className="mt-1"
              placeholder="Enter stream name"
            />
          </div>

          <div>
            <Label htmlFor="url">Stream URL</Label>
            <Input
              id="url"
              value={config.url}
              onChange={(e) => setConfig({...config, url: e.target.value})}
              className="mt-1"
              placeholder="http://192.168.1.100:8080/stream"
            />
          </div>

          <div>
            <Label htmlFor="robotId">Associated Robot</Label>
            <Select value={config.robotId} onValueChange={(value) => setConfig({...config, robotId: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select robot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="robot-001">Patrol Bot Alpha</SelectItem>
                <SelectItem value="robot-002">Guardian Beta</SelectItem>
                <SelectItem value="robot-003">Sentinel Gamma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};