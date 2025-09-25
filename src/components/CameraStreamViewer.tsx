import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Maximize2, Minimize2, Volume2, VolumeX, RotateCcw } from "lucide-react";

import { CameraStream } from "@/hooks/useSettings";

interface CameraStreamViewerProps {
  stream: CameraStream;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CameraStreamViewer = ({ stream, isOpen, onOpenChange }: CameraStreamViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleReload = () => {
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 1000);
  };

  const StreamContent = () => (
    <div className="relative bg-background rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading stream...</p>
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
          {/* Actual camera stream */}
          <iframe
            src={stream.streamUrl}
            className="w-full h-full border-0"
            title={`${stream.name} Live Feed`}
            allow="camera; microphone"
            onError={() => {
              console.log('Stream failed to load, showing fallback');
            }}
          />
          {/* Fallback content if iframe fails */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center" 
               style={{ zIndex: stream.streamUrl.includes('demo') ? 1 : -1 }}>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
              </div>
              <p className="text-lg font-semibold text-foreground">Live Feed Active</p>
              <p className="text-sm text-muted-foreground">Camera: {stream.name}</p>
              <p className="text-xs text-muted-foreground">URL: {stream.streamUrl}</p>
            </div>
          </div>
          
          {/* Stream overlay controls */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <Badge className="bg-success text-success-foreground">
              LIVE
            </Badge>
          </div>
          
          <div className="absolute bottom-2 left-2 text-white bg-black/70 px-2 py-1 rounded text-xs">
            Robot: {stream.associatedRobot}
          </div>
        </div>
      )}
      
      {/* Control bar */}
      <div className="flex items-center justify-between p-3 bg-card border-t">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReload}
          >
            <RotateCcw size={14} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <Dialog open={isOpen && isFullscreen} onOpenChange={(open) => {
        if (!open) setIsFullscreen(false);
      }}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
          <StreamContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen && !isFullscreen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{stream.name} - Live Stream</DialogTitle>
        </DialogHeader>
        <StreamContent />
      </DialogContent>
    </Dialog>
  );
};