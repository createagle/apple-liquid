import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-[10px] bg-fill-tertiary", className)}
      {...props}
    />
  )
}

export { Skeleton }
