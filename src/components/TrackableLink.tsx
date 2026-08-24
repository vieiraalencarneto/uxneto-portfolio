"use client";

import Link, { type LinkProps } from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = LinkProps & {
  className?: string;
  "aria-label"?: string;
  title?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  trackingEvent: string;
  trackingParams?: Record<string, unknown>;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function TrackableLink({
  trackingEvent,
  trackingParams,
  onClick,
  children,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(trackingEvent, trackingParams);
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
