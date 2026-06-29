"use client"

import * as React from "react"

export type Role = "superadmin" | "facility_admin"

export interface Session {
  role: Role
  facilityId: string | null
}

interface SessionContextValue extends Session {
  setSession: (s: Session) => void
  /** Facility id to scope data to (null = full access). */
  scopedFacilityId: string | null
}

const DEFAULT: Session = { role: "superadmin", facilityId: null }
const STORAGE_KEY = "rvc-session"

const SessionContext = React.createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = React.useState<Session>(DEFAULT)

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSessionState(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  const setSession = React.useCallback((s: Session) => {
    setSessionState(s)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    } catch {
      /* ignore */
    }
  }, [])

  const value: SessionContextValue = {
    ...session,
    setSession,
    scopedFacilityId: session.role === "facility_admin" ? session.facilityId : null,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const ctx = React.useContext(SessionContext)
  if (!ctx) throw new Error("useSession must be used within SessionProvider")
  return ctx
}
