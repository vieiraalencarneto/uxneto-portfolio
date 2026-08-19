"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export function useGeoCapture() {
  const posthog = usePostHog();

  useEffect(() => {
    if (!navigator.geolocation) return;
    if (!posthog) return;
    if (sessionStorage.getItem("geo_requested")) return;
    sessionStorage.setItem("geo_requested", "1");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log("[geo] captured", latitude, longitude);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "pt-BR" } },
          );
          const data = await res.json();
          const addr = data.address ?? {};

          posthog.capture("geo_located", {
            geo_latitude: latitude,
            geo_longitude: longitude,
            geo_accuracy_m: accuracy,
            geo_street: addr.road ?? addr.pedestrian ?? addr.path ?? null,
            geo_number: addr.house_number ?? null,
            geo_neighbourhood: addr.neighbourhood ?? addr.suburb ?? addr.quarter ?? null,
            geo_city: addr.city ?? addr.town ?? addr.village ?? null,
            geo_state: addr.state ?? null,
            geo_country: addr.country ?? null,
            geo_display_name: data.display_name ?? null,
            $set: {
              geo_latitude: latitude,
              geo_longitude: longitude,
              geo_street: addr.road ?? addr.pedestrian ?? addr.path ?? null,
              geo_number: addr.house_number ?? null,
              geo_neighbourhood: addr.neighbourhood ?? addr.suburb ?? addr.quarter ?? null,
              geo_city: addr.city ?? addr.town ?? addr.village ?? null,
              geo_state: addr.state ?? null,
            },
          });
        } catch (err) {
          console.warn("[geo] reverse geocoding failed", err);
          posthog.capture("geo_located", {
            geo_latitude: latitude,
            geo_longitude: longitude,
            geo_accuracy_m: accuracy,
          });
        }
      },
      (err) => console.warn("[geo] denied or error", err.code, err.message),
    );
  }, [posthog]);
}
