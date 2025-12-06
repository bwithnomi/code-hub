"use client";

import { useState, useEffect, useTransition } from "react";
import { updateUserPreferences } from "@/actions/user-preferences.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { codingLanguages } from "@/app/constants";
import { toast } from "sonner";

interface SnippetPreferencesProps {
  preferences: any;
  onPreferencesChange: (prefs: any) => void;
}

export default function SnippetPreferences({ preferences, onPreferencesChange }: SnippetPreferencesProps) {
  const [isPending, startTransition] = useTransition();
  const [defaultLanguage, setDefaultLanguage] = useState<string>(preferences?.defaultLanguage || "javascript");
  const [aiEnabled, setAiEnabled] = useState<boolean>(preferences?.aiTitleGenerationEnabled ?? true);

  useEffect(() => {
    if (preferences) {
      setDefaultLanguage(preferences.defaultLanguage || "javascript");
      setAiEnabled(preferences.aiTitleGenerationEnabled ?? true);
    }
  }, [preferences]);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateUserPreferences({
        theme: preferences?.theme || "system",
        editorTheme: preferences?.editorTheme || "vs-dark",
        editorFontSize: preferences?.editorFontSize || 14,
        defaultLanguage,
        aiTitleGenerationEnabled: aiEnabled,
      });

      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success("Snippet preferences saved");
        if (result.data) {
          onPreferencesChange(result.data);
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Snippet Preferences</CardTitle>
        <CardDescription>Configure default settings for new snippets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="default-language">Default Language</Label>
          <Select value={defaultLanguage} onValueChange={setDefaultLanguage} disabled={isPending}>
            <SelectTrigger id="default-language" className="w-full">
              <SelectValue placeholder="Select default language" />
            </SelectTrigger>
            <SelectContent>
              {codingLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-toggle">AI Title Generation</Label>
            <button
              id="ai-toggle"
              type="button"
              onClick={() => setAiEnabled(!aiEnabled)}
              disabled={isPending}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aiEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aiEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Enable AI-powered title generation when creating new snippets
          </p>
        </div>

        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save Snippet Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}

