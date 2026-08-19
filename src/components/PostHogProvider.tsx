"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "identified_only",
    capture_pageview: false,
    session_recording: {
      maskAllInputs: true,
    },
    capture_heatmaps: true,
  });
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!ph) return;
    const url = searchParams.toString()
      ? `${window.location.origin}${pathname}?${searchParams.toString()}`
      : `${window.location.origin}${pathname}`;
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  useEffect(() => {
    if (!ph || !navigator.geolocation) return;
    if (sessionStorage.getItem("geo_requested")) return;
    sessionStorage.setItem("geo_requested", "1");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        ph.capture("geo_located", {
          $set: {
            geo_latitude: pos.coords.latitude,
            geo_longitude: pos.coords.longitude,
            geo_accuracy_m: pos.coords.accuracy,
          },
        });
      },
      () => {},
      { timeout: 8000 },
    );
  }, [ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
