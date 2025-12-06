"use client";

import { useState, useEffect, useTransition } from "react";
import { useTheme } from "next-themes";
import { updateUserPreferences } from "@/actions/user-preferences.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const MONACO_THEMES = [
  { value: "vs-dark", label: "VS Dark" },
  { value: "vs-light", label: "VS Light" },
  { value: "hc-black", label: "High Contrast Dark" },
  { value: "hc-light", label: "High Contrast Light" },
];

interface AppearanceSettingsProps {
  preferences: any;
  onPreferencesChange: (prefs: any) => void;
}

export default function AppearanceSettings({ preferences, onPreferencesChange }: AppearanceSettingsProps) {
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [localTheme, setLocalTheme] = useState<string>(theme || "system");
  const [editorTheme, setEditorTheme] = useState<string>(preferences?.editorTheme || "vs-dark");
  const [fontSize, setFontSize] = useState<number>(preferences?.editorFontSize || 14);

  useEffect(() => {
    if (preferences) {
      setEditorTheme(preferences.editorTheme || "vs-dark");
      setFontSize(preferences.editorFontSize || 14);
    }
  }, [preferences]);

  useEffect(() => {
    setLocalTheme(theme || "system");
  }, [theme]);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateUserPreferences({
        theme: localTheme as "light" | "dark" | "system",
        editorTheme,
        editorFontSize: fontSize,
        defaultLanguage: preferences?.defaultLanguage || "javascript",
        aiTitleGenerationEnabled: preferences?.aiTitleGenerationEnabled ?? true,
      });

      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success("Appearance settings saved");
        if (result.data) {
          onPreferencesChange(result.data);
        }
        // Update app theme
        setTheme(localTheme);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance & Theme</CardTitle>
        <CardDescription>Customize the appearance of the application and code editor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Application Theme</Label>
          <Select value={localTheme} onValueChange={setLocalTheme} disabled={isPending}>
            <SelectTrigger id="theme" className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="editor-theme">Editor Color Scheme</Label>
          <Select value={editorTheme} onValueChange={setEditorTheme} disabled={isPending}>
            <SelectTrigger id="editor-theme" className="w-full">
              <SelectValue placeholder="Select editor theme" />
            </SelectTrigger>
            <SelectContent>
              {MONACO_THEMES.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size">Code Editor Font Size</Label>
          <Input
            id="font-size"
            type="number"
            min="12"
            max="24"
            value={fontSize}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 12 && value <= 24) {
                setFontSize(value);
              }
            }}
            disabled={isPending}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">Font size between 12px and 24px</p>
        </div>

        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save Appearance Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}

