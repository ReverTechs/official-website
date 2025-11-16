import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-border/50 bg-background/50",
          "px-3 py-2 text-sm",
          "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "placeholder:text-muted-foreground/60",
          "focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background",
          "hover:border-border",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "backdrop-blur-sm",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
