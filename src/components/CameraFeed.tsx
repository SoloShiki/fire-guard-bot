import { Card } from "@/components/ui/card";

interface CameraFeedProps {
  id: string;
  name: string;
  status: "active" | "alert" | "offline";
  image: string;
  location: string;
}

export const CameraFeed = ({ id, name, status, image, location }: CameraFeedProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-status-active";
      case "alert":
        return "bg-status-alert";
      case "offline":
        return "bg-status-offline";
      default:
        return "bg-muted";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "ACTIVE";
      case "alert":
        return "ALERT";
      case "offline":
        return "OFFLINE";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <Card className="overflow-hidden border-border bg-card hover:bg-card/80 transition-colors">
      <div className="relative">
        <img
          src={image}
          alt={`${name} camera feed`}
          className="w-full h-32 object-cover"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${getStatusColor()} text-white`}>
          {getStatusText()}
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          ID: {id}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{location}</p>
      </div>
    </Card>
  );
};