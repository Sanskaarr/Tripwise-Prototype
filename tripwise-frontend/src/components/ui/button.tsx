import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // TripWise Hero Button - Primary CTA
        hero: "bg-primary text-primary-foreground px-8 py-4 text-base font-semibold tracking-wide uppercase hover:scale-[1.02] hover:shadow-lg transition-all duration-500",
        // TripWise Hero Button - Secondary/Ghost
        heroOutline: "border-2 border-foreground/20 bg-transparent text-foreground px-8 py-4 text-base font-semibold tracking-wide uppercase hover:bg-foreground/5 hover:border-foreground/40 transition-all duration-500",
        // Planning Step Continue Button
        continue: "bg-primary text-primary-foreground px-10 py-5 text-base font-semibold tracking-wide rounded-2xl hover:scale-[1.02] hover:shadow-lg transition-all duration-500 w-full md:w-auto",
        // Back Button
        back: "text-muted-foreground hover:text-foreground px-6 py-3 transition-colors duration-300",
        // Option Selection
        option: "w-full justify-start text-left p-6 h-auto border-2 border-border bg-card rounded-2xl hover:border-primary/30 hover:shadow-md data-[selected=true]:border-primary data-[selected=true]:bg-primary/5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
