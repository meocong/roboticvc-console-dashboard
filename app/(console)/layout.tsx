import type { ReactNode } from "react"
import { ConsoleShell } from "@/components/console/console-shell"
import { SessionProvider } from "@/lib/session"

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ConsoleShell>{children}</ConsoleShell>
    </SessionProvider>
  )
}
