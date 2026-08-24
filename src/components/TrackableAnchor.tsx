"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  trackingEvent: string;
  trackingParams?: Record<string, unknown>;
};

export function TrackableAnchor({
  trackingEvent,
  trackingParams,
  onClick,
  children,
  ...props
}: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(trackingEvent, trackingParams);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
