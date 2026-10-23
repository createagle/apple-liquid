import { cn } from "cn"
import { Loader2Icon } from "lucide-react"
import { useIntlayer } from "next-intlayer"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const content = useIntlayer("spinner")

  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label={content.label.value} className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
