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
    resolution: "1080p",
    frameRate: "30",
    nightVision: true,
    motionRecording: false,
    audioRecording: false,
    streamQuality: "high",
    autoFocus: true,
    exposureMode: "auto"
  });
  const { toast } = useToast();

  const handleSave = () => {
    // Save to localStorage
    const savedConfigs = JSON.parse(localStorage.getItem('cameraConfigs') || '{}');
    savedConfigs[stream.id] = config;
    localStorage.setItem('cameraConfigs', JSON.stringify(savedConfigs));
    
    onSave(stream.id, config);
    onOpenChange(false);
    
    toast({
      title: "Camera Configuration Saved",
      description: `Settings for ${stream.name} have been updated`,
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
            <Label htmlFor="resolution">Video Resolution</Label>
            <Select value={config.resolution} onValueChange={(value) => setConfig({...config, resolution: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="720p">720p HD</SelectItem>
                <SelectItem value="1080p">1080p Full HD</SelectItem>
                <SelectItem value="4k">4K Ultra HD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="framerate">Frame Rate (FPS)</Label>
            <Select value={config.frameRate} onValueChange={(value) => setConfig({...config, frameRate: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 FPS</SelectItem>
                <SelectItem value="24">24 FPS</SelectItem>
                <SelectItem value="30">30 FPS</SelectItem>
                <SelectItem value="60">60 FPS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quality">Stream Quality</Label>
            <Select value={config.streamQuality} onValueChange={(value) => setConfig({...config, streamQuality: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Save bandwidth</SelectItem>
                <SelectItem value="medium">Medium - Balanced</SelectItem>
                <SelectItem value="high">High - Best quality</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exposure">Exposure Mode</Label>
            <Select value={config.exposureMode} onValueChange={(value) => setConfig({...config, exposureMode: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto Exposure</SelectItem>
                <SelectItem value="manual">Manual Control</SelectItem>
                <SelectItem value="lowlight">Low Light Mode</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Night Vision</Label>
                <p className="text-xs text-muted-foreground">Enable infrared night vision</p>
              </div>
              <Switch 
                checked={config.nightVision} 
                onCheckedChange={(checked) => setConfig({...config, nightVision: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Motion Recording</Label>
                <p className="text-xs text-muted-foreground">Record when motion is detected</p>
              </div>
              <Switch 
                checked={config.motionRecording} 
                onCheckedChange={(checked) => setConfig({...config, motionRecording: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Audio Recording</Label>
                <p className="text-xs text-muted-foreground">Include audio in recordings</p>
              </div>
              <Switch 
                checked={config.audioRecording} 
                onCheckedChange={(checked) => setConfig({...config, audioRecording: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Focus</Label>
                <p className="text-xs text-muted-foreground">Automatically adjust focus</p>
              </div>
              <Switch 
                checked={config.autoFocus} 
                onCheckedChange={(checked) => setConfig({...config, autoFocus: checked})}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};