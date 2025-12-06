"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import SnippetPreferences from "@/components/settings/SnippetPreferences";
import ExportSettings from "@/components/settings/ExportSettings";

interface SettingsClientProps {
  initialPreferences: any;
}

export default function SettingsClient({ initialPreferences }: SettingsClientProps) {
  const [preferences, setPreferences] = useState(initialPreferences);

  return (
    <div className="px-6 py-6">
      <h1 className="font-bold text-2xl mb-6">Settings</h1>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="snippets">Snippets</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="mt-6">
          <AppearanceSettings preferences={preferences} onPreferencesChange={setPreferences} />
        </TabsContent>
        
        <TabsContent value="snippets" className="mt-6">
          <SnippetPreferences preferences={preferences} onPreferencesChange={setPreferences} />
        </TabsContent>
        
        <TabsContent value="export" className="mt-6">
          <ExportSettings />
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

