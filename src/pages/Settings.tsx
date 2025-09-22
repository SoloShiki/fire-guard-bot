import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, Bell, Volume2, Shield, User, Smartphone, Wifi } from "lucide-react";
import { RobotManagement } from "@/components/RobotManagement";
import { CameraStreaming } from "@/components/CameraStreaming";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Settings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    primaryContact: "",
    secondaryContact: "",
    emailContact: "",
    companyName: "",
    facilityId: "",
    pushNotifications: true,
    emailAlerts: true,
    smsAlerts: false,
    alertSound: "siren"
  });

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('firevolxSettings');
    if (savedSettings) {
      setFormData({ ...formData, ...JSON.parse(savedSettings) });
    }
  }, []);

  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem('firevolxSettings', JSON.stringify(formData));
    
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated",
    });
  };
  return (
    <Layout>
      <div className="p-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your Firevolx monitoring system</p>
        </div>

        <div className="space-y-6">
          {/* Emergency Contacts */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Phone className="text-emergency" size={20} />
                <span>Emergency Contacts</span>
              </CardTitle>
              <CardDescription>Set up emergency response contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primary-contact" className="text-foreground">Primary Contact</Label>
                <Input 
                  id="primary-contact" 
                  placeholder="+1 (555) 123-4567" 
                  value={formData.primaryContact}
                  onChange={(e) => setFormData({...formData, primaryContact: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="secondary-contact" className="text-foreground">Secondary Contact</Label>
                <Input 
                  id="secondary-contact" 
                  placeholder="+1 (555) 987-6543" 
                  value={formData.secondaryContact}
                  onChange={(e) => setFormData({...formData, secondaryContact: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email-contact" className="text-foreground">Emergency Email</Label>
                <Input 
                  id="email-contact" 
                  type="email"
                  placeholder="emergency@company.com" 
                  value={formData.emailContact}
                  onChange={(e) => setFormData({...formData, emailContact: e.target.value})}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Alert Settings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Bell className="text-warning" size={20} />
                <span>Alert Settings</span>
              </CardTitle>
              <CardDescription>Configure alert behavior and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                </div>
                <Switch 
                  checked={formData.pushNotifications} 
                  onCheckedChange={(checked) => setFormData({...formData, pushNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send alerts via email</p>
                </div>
                <Switch 
                  checked={formData.emailAlerts} 
                  onCheckedChange={(checked) => setFormData({...formData, emailAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
                </div>
                <Switch 
                  checked={formData.smsAlerts} 
                  onCheckedChange={(checked) => setFormData({...formData, smsAlerts: checked})}
                />
              </div>

              <div>
                <Label className="text-foreground">Alert Sound</Label>
                <Select 
                  value={formData.alertSound} 
                  onValueChange={(value) => setFormData({...formData, alertSound: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="siren">Emergency Siren</SelectItem>
                    <SelectItem value="alarm">Industrial Alarm</SelectItem>
                    <SelectItem value="beep">Warning Beep</SelectItem>
                    <SelectItem value="voice">Voice Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Robot Management */}
          <RobotManagement />

          <Separator className="my-6" />

          {/* Camera Streaming */}
          <CameraStreaming />

          {/* Account Settings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <User className="text-foreground" size={20} />
                <span>Account</span>
              </CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name" className="text-foreground">Company Name</Label>
                <Input 
                  id="company-name" 
                  placeholder="Acme Industries" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="facility-id" className="text-foreground">Facility ID</Label>
                <Input 
                  id="facility-id" 
                  placeholder="FAC-001" 
                  value={formData.facilityId}
                  onChange={(e) => setFormData({...formData, facilityId: e.target.value})}
                  className="mt-1"
                />
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleSaveSettings}
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;