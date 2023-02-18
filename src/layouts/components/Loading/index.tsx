import { CircleDashed } from 'phosphor-react'

interface LoadingProps {
  message?: string
}
export function Loading({ message }: LoadingProps) {
  return (
    <div className="absolute top-0 left-0 flex h-screen w-screen flex-col items-center justify-center gap-2 bg-chattou-background/50">
      <CircleDashed size="48" weight="bold" className="animate-spin" />
      {message && <span className="text-2xl">{message}</span>}
    </div>
  )
}
