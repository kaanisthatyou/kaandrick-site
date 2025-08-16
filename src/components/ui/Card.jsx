import React, { forwardRef, useId } from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

export const Card = forwardRef(function Card(
  { as: As = "div", className = "", interactive = false, role, ...props },
  ref
) {
  return (
    <As
      ref={ref}
      role={role || (interactive ? "group" : undefined)}
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur transition-colors",
        interactive &&
          "hover:bg-white/[0.06] focus-within:bg-white/[0.06] focus-within:outline focus-within:outline-2 focus-within:outline-amber-400 focus-within:outline-offset-2",
        "[container-type:inline-size]", // enables container queries later if needed
        className
      )}
      {...props}
    />
  );
});

export function CardHeader({ children, className = "" }) {
  return <div className={cn("px-6 pt-6", className)}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={cn("px-6 pb-6 pt-0 flex items-center gap-3", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", as: As = "h3", id }) {
  const auto = useId();
  return (
    <As id={id || auto} className={cn("text-xl font-semibold", className)}>
      {children}
    </As>
  );
}
