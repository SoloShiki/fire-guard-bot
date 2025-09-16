import { AlertButton } from "@/components/AlertButton";
import { CameraFeed } from "@/components/CameraFeed";
import { Layout } from "@/components/Layout";
import factoryFeed1 from "@/assets/factory-feed-1.jpg";
import factoryFeed2 from "@/assets/factory-feed-2.jpg";
import factoryFeed3 from "@/assets/factory-feed-3.jpg";
import factoryFeed4 from "@/assets/factory-feed-4.jpg";

const mockCameraFeeds = [
  {
    id: "RBT-001",
    name: "Conveyor Belt Monitor",
    status: "active" as const,
    image: factoryFeed1,
    location: "Production Line A"
  },
  {
    id: "RBT-002", 
    name: "Assembly Line Scanner",
    status: "active" as const,
    image: factoryFeed2,
    location: "Manufacturing Floor"
  },
  {
    id: "RBT-003",
    name: "Warehouse Safety Monitor",  
    status: "standby" as const,
    image: factoryFeed3,
    location: "Storage Area B"
  },
  {
    id: "RBT-004",
    name: "Chemical Processing Monitor",
    status: "alert" as const,
    image: factoryFeed4,
    location: "Processing Plant C"
  }
];

const Home = () => {
  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">FIREVOLX</h1>
          <p className="text-muted-foreground">Industrial Safety Monitoring System</p>
        </div>

        {/* Emergency Alert Button */}
        <div className="mb-8">
          <AlertButton />
        </div>

        {/* Live Camera Feeds */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Live Camera Feeds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCameraFeeds.map((feed) => (
              <CameraFeed key={feed.id} {...feed} />
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3">System Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Robots:</span>
              <span className="text-status-active font-semibold">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">On Standby:</span>
              <span className="text-status-standby font-semibold">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alerts:</span>
              <span className="text-status-alert font-semibold">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offline:</span>
              <span className="text-status-offline font-semibold">0</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;