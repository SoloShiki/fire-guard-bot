import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Video, ExternalLink, Play, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CameraConfigDialog } from "./CameraConfigDialog";
import { CameraStreamViewer } from "./CameraStreamViewer";

interface CameraStream {
  id: string;
  name: string;
  url: string;
  status: "active" | "offline";
  robotId: string;
}

const mockStreams: CameraStream[] = [
  {
    id: "CAM-001",
    name: "Main Entrance Camera",
    url: "https://demo.ip-cam.com/demo1",
    status: "active",
    robotId: "RBT-001"
  },
  {
    id: "CAM-002",
    name: "Factory Floor Camera",
    url: "https://demo.ip-cam.com/demo2", 
    status: "active",
    robotId: "RBT-002"
  },
  {
    id: "CAM-003",
    name: "Emergency Exit Camera",
    url: "https://demo.ip-cam.com/demo3",
    status: "active",
    robotId: "RBT-003"
  }
];

export const CameraStreaming = () => {
  const [streams, setStreams] = useState<CameraStream[]>(mockStreams);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<CameraStream | null>(null);
  const [streamName, setStreamName] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [robotId, setRobotId] = useState("");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground";
  };

  const openStream = (url: string) => {
    window.open(url, '_blank', 'width=800,height=600');
  };

  const openStreamInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAddStream = () => {
    if (!streamName || !streamUrl || !robotId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newStream: CameraStream = {
      id: `CAM-${String(streams.length + 1).padStart(3, '0')}`,
      name: streamName,
      url: streamUrl,
      status: "active",
      robotId: robotId,
    };

    setStreams([...streams, newStream]);
    setStreamName("");
    setStreamUrl("");
    setRobotId("");
    setIsAddDialogOpen(false);
    
    toast({
      title: "Stream Added",
      description: `${streamName} has been successfully added`,
    });
  };

  const handleDeleteStream = (streamId: string, streamName: string) => {
    setStreams(streams.filter(stream => stream.id !== streamId));
    toast({
      title: "Stream Removed",
      description: `${streamName} has been removed`,
    });
  };

  const handleConfigureStream = (stream: CameraStream) => {
    setSelectedStream(stream);
    setIsConfigDialogOpen(true);
  };

  const handleViewStream = (stream: CameraStream) => {
    setSelectedStream(stream);
    setIsViewerOpen(true);
  };

  const handleSaveStreamConfig = (streamId: string, config: any) => {
    // Save to localStorage
    const savedConfigs = JSON.parse(localStorage.getItem('cameraConfigs') || '{}');
    savedConfigs[streamId] = config;
    localStorage.setItem('cameraConfigs', JSON.stringify(savedConfigs));
    
    // Update stream in the list if needed
    setStreams(streams.map(stream => 
      stream.id === streamId 
        ? { ...stream, ...config }
        : stream
    ));
    
    toast({
      title: "Camera Configuration Saved",
      description: `Settings for stream ${streamId} have been updated`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Camera Streaming</h3>
          <p className="text-sm text-muted-foreground">Access live camera feeds from your robots</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Video size={16} className="mr-2" />
              Add Stream
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Camera Stream</DialogTitle>
              <DialogDescription>
                Configure a new camera stream from your robot
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stream-name">Stream Name</Label>
                <Input 
                  id="stream-name" 
                  placeholder="Main Entrance Camera"
                  value={streamName}
                  onChange={(e) => setStreamName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="stream-url">Stream URL</Label>
                <Input 
                  id="stream-url" 
                  placeholder="https://your-robot.local/stream"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="robot-select">Associated Robot</Label>
                <Input 
                  id="robot-select" 
                  placeholder="RBT-001"
                  value={robotId}
                  onChange={(e) => setRobotId(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAddStream}
              >
                <Video size={16} className="mr-2" />
                Add Stream
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {streams.map((stream) => (
          <Card key={stream.id} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Video className="text-primary" size={20} />
                  <div>
                    <CardTitle className="text-base text-foreground">{stream.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">Robot: {stream.robotId}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(stream.status)}>
                    {stream.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Stream URL:</span>
                  <span className="ml-2 text-foreground font-mono text-xs break-all">{stream.url}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleViewStream(stream)}
                  disabled={stream.status === "offline"}
                >
                  <Play size={14} className="mr-1" />
                  View Stream
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openStreamInNewTab(stream.url)}
                  disabled={stream.status === "offline"}
                >
                  <ExternalLink size={14} className="mr-1" />
                  Open
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleConfigureStream(stream)}
                >
                  <Settings size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-emergency border-emergency hover:bg-emergency hover:text-emergency-foreground"
                  onClick={() => handleDeleteStream(stream.id, stream.name)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStream && (
        <>
          <CameraConfigDialog
            stream={selectedStream}
            isOpen={isConfigDialogOpen}
            onOpenChange={setIsConfigDialogOpen}
            onSave={handleSaveStreamConfig}
          />
          <CameraStreamViewer
            stream={selectedStream}
            isOpen={isViewerOpen}
            onOpenChange={setIsViewerOpen}
          />
        </>
      )}
    </div>
  );
};