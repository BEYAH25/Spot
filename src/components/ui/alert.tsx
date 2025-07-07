import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-2xl border px-6 py-4 text-sm glass-card [&>svg]:absolute [&>svg]:left-6 [&>svg]:top-6 [&>svg]:text-current [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-14",
  {
    variants: {
      variant: {
        default: "text-white border-white/20",
        destructive:
          "border-red-500/30 text-red-200 [&>svg]:text-red-400 bg-red-500/10",
        warning:
          "border-yellow-500/30 text-yellow-200 [&>svg]:text-yellow-400 bg-yellow-500/10",
        success:
          "border-green-500/30 text-green-200 [&>svg]:text-green-400 bg-green-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      className={cn("mb-2 font-bold leading-none tracking-tight text-lg", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm leading-relaxed opacity-90", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }