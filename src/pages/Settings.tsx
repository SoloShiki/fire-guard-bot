import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Bell, Volume2, Shield, User, Smartphone, Wifi } from "lucide-react";

const Settings = () => {
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
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="secondary-contact" className="text-foreground">Secondary Contact</Label>
                <Input 
                  id="secondary-contact" 
                  placeholder="+1 (555) 987-6543" 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email-contact" className="text-foreground">Emergency Email</Label>
                <Input 
                  id="email-contact" 
                  type="email"
                  placeholder="emergency@company.com" 
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
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send alerts via email</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
                </div>
                <Switch />
              </div>

              <div>
                <Label className="text-foreground">Alert Sound</Label>
                <Select defaultValue="siren">
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

          {/* Robot Management */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Smartphone className="text-status-active" size={20} />
                <span>Robot Management</span>
              </CardTitle>
              <CardDescription>Manage your Firevolx robots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Auto-Discovery</Label>
                  <p className="text-sm text-muted-foreground">Automatically detect new robots</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button variant="outline" className="w-full">
                <Wifi className="mr-2" size={16} />
                Scan for New Robots
              </Button>

              <Button variant="outline" className="w-full">
                <Shield className="mr-2" size={16} />
                View Robot Status
              </Button>
            </CardContent>
          </Card>

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
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="facility-id" className="text-foreground">Facility ID</Label>
                <Input 
                  id="facility-id" 
                  placeholder="FAC-001" 
                  className="mt-1"
                />
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90">
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