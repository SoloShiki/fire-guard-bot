import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

interface FireDetectionEvent {
  robotId: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  timestamp: Date;
}

interface FireDetectionSystemProps {
  onFireDetected: (event: FireDetectionEvent) => void;
}

export const FireDetectionSystem = ({ onFireDetected }: FireDetectionSystemProps) => {
  const { settings } = useSettings();
  const [isMonitoring, setIsMonitoring] = useState(true);
  
  // Real fire detection simulation based on actual robot data
  useEffect(() => {
    if (!isMonitoring || settings.robots.length === 0) return;
    
    const checkInterval = setInterval(() => {
      // Only trigger fire detection for real, online robots
      const activeRobots = settings.robots.filter(robot => robot.status === 'online');
      
      if (activeRobots.length === 0) return;
      
      // Simulate real detection with low probability (0.1% chance per check)
      const shouldDetectFire = Math.random() < 0.001;
      
      if (shouldDetectFire) {
        const randomRobot = activeRobots[Math.floor(Math.random() * activeRobots.length)];
        
        const fireEvent: FireDetectionEvent = {
          robotId: randomRobot.id,
          location: randomRobot.location,
          severity: Math.random() > 0.7 ? "critical" : Math.random() > 0.5 ? "high" : "medium",
          confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
          timestamp: new Date()
        };
        
        onFireDetected(fireEvent);
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(checkInterval);
  }, [isMonitoring, settings.robots, onFireDetected]);
  
  return null; // This is a background service component
};