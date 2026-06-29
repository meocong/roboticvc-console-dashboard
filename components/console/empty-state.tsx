import { InboxIcon } from "lucide-react"

export function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center animate-rise">
      <div className="relative flex size-14 items-center justify-center rounded-2xl border border-dashed bg-muted/40 text-muted-foreground">
        <InboxIcon className="size-6" />
        <span className="absolute -inset-1.5 -z-10 rounded-3xl bg-primary/5 blur-md" />
      </div>
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
