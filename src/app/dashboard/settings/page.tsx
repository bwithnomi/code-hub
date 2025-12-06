import { getUserPreferences } from "@/actions/user-preferences.action";
import SettingsClient from "./SettingsClient";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  // Fetch preferences on the server
  const result = await getUserPreferences();
  const preferences = result.error ? null : result.data;

  return <SettingsClient initialPreferences={preferences} />;
}

