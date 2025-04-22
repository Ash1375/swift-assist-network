
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Settings as SettingsIcon, User, BarChart } from "lucide-react"
import ProfileSettings from "@/components/settings/ProfileSettings"
import ThemeCustomizer from "@/components/settings/ThemeCustomizer"
import UsageStats from "@/components/settings/UsageStats"

const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User size={16} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <SettingsIcon size={16} />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart size={16} />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <ThemeCustomizer />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <UsageStats />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage
