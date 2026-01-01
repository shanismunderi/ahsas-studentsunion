import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-accent to-amber-600 text-accent-foreground hover:from-accent/90 hover:to-amber-600/90 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30",
        destructive: "bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground hover:from-destructive/90 hover:to-red-600/90 shadow-lg shadow-destructive/20",
        outline: "border-2 border-accent/50 bg-transparent text-accent hover:bg-accent/10 hover:border-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "text-accent underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-accent to-amber-600 text-accent-foreground hover:from-accent/90 hover:to-amber-600/90 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/40",
        hero: "bg-gradient-to-r from-accent to-amber-600 text-accent-foreground hover:from-accent/90 hover:to-amber-600/90 shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 text-base font-bold",
        "hero-outline": "border-2 border-accent/30 bg-accent/10 text-foreground hover:bg-accent/20 hover:border-accent/50 backdrop-blur-sm",
        nav: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary",
        premium: "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/25",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
