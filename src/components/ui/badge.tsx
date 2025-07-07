import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 hover:scale-105 border backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30",
        secondary:
          "bg-white/10 text-white/90 border-white/20 hover:bg-white/15",
        destructive:
          "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-200 border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30",
        outline:
          "text-white border-white/30 hover:bg-white/10",
        success:
          "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30",
        warning:
          "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-200 border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }