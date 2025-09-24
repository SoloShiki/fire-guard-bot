import { AlertButton } from "@/components/AlertButton";
import { CameraFeed } from "@/components/CameraFeed";
import { Layout } from "@/components/Layout";
import { FireAlertNotification } from "@/components/FireAlertNotification";
import { useSettings } from "@/hooks/useSettings";
import { useState, useEffect } from "react";

const Home = () => {
  const { settings, updateCameraStream } = useSettings();
  const [fireAlert, setFireAlert] = useState<{
    isVisible: boolean;
    location: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
  }>({
    isVisible: false,
    location: "",
    severity: "LOW"
  });

  // Simulate fire detection from ROS2 system
  useEffect(() => {
    const checkForFireAlerts = () => {
      // This would be replaced with actual ROS2 integration
      const alertProbability = Math.random();
      if (alertProbability < 0.001) { // Very low probability for demo
        const locations = settings.cameraStreams.map(s => s.location);
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        setFireAlert({
          isVisible: true,
          location: randomLocation,
          severity: alertProbability < 0.0003 ? "HIGH" : alertProbability < 0.0007 ? "MEDIUM" : "LOW"
        });
      }
    };

    const interval = setInterval(checkForFireAlerts, 5000);
    return () => clearInterval(interval);
  }, [settings.cameraStreams]);

  const activeRobots = settings.robots.filter(r => r.status === 'online').length;
  const alertRobots = settings.robots.filter(r => r.status === 'alert').length;
  const offlineRobots = settings.robots.filter(r => r.status === 'offline').length;

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.cameraStreams.map((feed) => (
              <CameraFeed 
                key={feed.id} 
                id={feed.id}
                name={feed.name}
                status={feed.status}
                streamUrl={feed.streamUrl}
                location={feed.location}
              />
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3">System Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Robots:</span>
              <span className="text-status-active font-semibold">{activeRobots}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alerts:</span>
              <span className="text-status-alert font-semibold">{alertRobots}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offline:</span>
              <span className="text-status-offline font-semibold">{offlineRobots}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Robots:</span>
              <span className="text-foreground font-semibold">{settings.robots.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fire Alert Notification */}
      <FireAlertNotification
        isVisible={fireAlert.isVisible}
        location={fireAlert.location}
        severity={fireAlert.severity}
        onDismiss={() => setFireAlert(prev => ({ ...prev, isVisible: false }))}
      />
    </Layout>
  );
};

export default Home;