import { createClient as createServiceClient } from "@supabase/supabase-js";
import { SettingsForm } from "@/components/admin/SettingsForm";

async function getSettings(): Promise<Record<string, string>> {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { data } = await supabase.from("site_settings").select("key, value");
  return Object.fromEntries((data ?? []).map(({ key, value }) => [key, value ?? ""]));
}

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)] mb-8">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
