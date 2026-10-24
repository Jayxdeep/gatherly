"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventInput, EventPlan } from "@/lib/schemas/event";
import { decodePlanFromHash } from "@/lib/export/shareUrl";

const STORAGE_KEY = "gatherly_saved_session_v1";

interface SavedSession {
  input: EventInput;
  plan: EventPlan;
  source?: string;
}

interface PlanSessionState {
  input: EventInput | null;
  plan: EventPlan | null;
  source: string;
}

const EMPTY: PlanSessionState = {
  input: null,
  plan: null,
  source: "planner",
};

export function usePlanSession() {
  const [session, setSession] = useState<PlanSessionState>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [sharedNotice, setSharedNotice] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const decoded = decodePlanFromHash(window.location.hash);
      if (decoded) {
        setSession({
          input: decoded.input,
          plan: decoded.plan,
          source: decoded.source || "shared-link",
        });
        setSharedNotice(true);
        return;
      }
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<SavedSession>;
      if (parsed?.input && parsed?.plan) {
        setSession({
          input: parsed.input,
          plan: parsed.plan,
          source: parsed.source || "local-cache",
        });
      }
    } catch {
      // A missing or malformed cache should not stop someone from planning.
    }
  }, []);

  const submitPlan = useCallback(async (input: EventInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          errorData?.error ||
            `The planner could not respond (error ${response.status}).`
        );
      }

      const data = (await response.json()) as {
        plan: EventPlan;
        source?: string;
      };

      setSession({
        input,
        plan: data.plan,
        source: data.source || "planner",
      });
      setSharedNotice(false);

      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            input,
            plan: data.plan,
            source: data.source,
          })
        );
      } catch {
        // Private browsing or a full quota should not block planning.
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPlan = useCallback(() => {
    setSession(EMPTY);
    setSharedNotice(false);
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage cleanup errors.
    }
  }, []);

  const dismissSharedNotice = useCallback(() => setSharedNotice(false), []);

  return {
    input: session.input,
    plan: session.plan,
    source: session.source,
    isLoading,
    sharedNotice,
    submitPlan,
    resetPlan,
    dismissSharedNotice,
  };
}
