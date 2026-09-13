import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getLoggedInMemberId, isLoggedIn } from "@/lib/auth";

const SESSION_KEY = "fr2p_visitor_session";
const EMAIL_CAPTURED_KEY = "fr2p_email_captured";

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `vs_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function getUtmParams(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
  };
}

export function trackPageView(path: string, title?: string) {
  const sessionId = getOrCreateSessionId();
  const utm = getUtmParams();

  fetch("/api/visitors/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      eventType: "page_view",
      pagePath: path,
      pageTitle: title || document.title,
      referrer: document.referrer || null,
      memberId: isLoggedIn() ? getLoggedInMemberId() : null,
      userAgent: navigator.userAgent,
      ...utm,
    }),
  }).catch(() => {});
}

export async function captureVisitorEmail(email: string, firstName?: string, pagePath?: string) {
  const sessionId = getOrCreateSessionId();
  const response = await fetch("/api/visitors/capture-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      email,
      firstName,
      pagePath: pagePath || window.location.pathname,
      referrer: document.referrer || null,
      memberId: isLoggedIn() ? getLoggedInMemberId() : null,
    }),
  });
  if (response.ok) {
    localStorage.setItem(EMAIL_CAPTURED_KEY, "true");
  }
  return response.json();
}

export function hasCapturedEmail(): boolean {
  return localStorage.getItem(EMAIL_CAPTURED_KEY) === "true";
}

export function useVisitorTracking() {
  const [location] = useLocation();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (location === lastTracked.current) return;
    lastTracked.current = location;
    trackPageView(location);
  }, [location]);
}
