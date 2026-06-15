import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import * as React from "react";

import { cn } from "@/src/utils/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-base text-sm font-heading ring-offset-white transition-all duration-150 gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-main-foreground bg-main border border-border/55 shadow-[inset_0_-3px_0_rgb(66_32_87_/_0.22),0_8px_18px_rgb(66_32_87_/_0.16)] hover:brightness-[1.02] active:shadow-[inset_0_2px_0_rgb(66_32_87_/_0.18)]",
        noShadow: "text-main-foreground bg-main border border-border/55",
        neutral:
          "bg-secondary-background text-foreground border border-border/25 shadow-[inset_0_-2px_0_rgb(66_32_87_/_0.08),0_6px_16px_rgb(66_32_87_/_0.10)] hover:border-border/40",
        reverse:
          "text-background bg-foreground border border-border/40 shadow-[inset_0_-3px_0_rgb(0_0_0_/_0.22),0_8px_18px_rgb(66_32_87_/_0.16)] hover:brightness-110",
      },
      size: {
        default: "min-h-11 px-4 py-2",
        sm: "min-h-11 px-3",
        lg: "min-h-12 px-6 sm:px-8",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
