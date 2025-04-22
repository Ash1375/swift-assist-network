
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

const ThemeCustomizer = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Customization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="compact-mode">Compact Mode</Label>
          <Switch
            id="compact-mode"
            checked={compactMode}
            onCheckedChange={setCompactMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="high-contrast">High Contrast</Label>
          <Switch
            id="high-contrast"
            checked={highContrast}
            onCheckedChange={setHighContrast}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ThemeCustomizer
