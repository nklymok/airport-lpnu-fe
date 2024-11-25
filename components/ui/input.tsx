import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { startIcon?: React.ReactNode }
>(({ className, type, startIcon, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value !== "");
  };

  return (
    <div className="relative flex items-center">
      {startIcon && (
        <div className="absolute left-2 flex items-center pointer-events-none">
          {startIcon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          startIcon && "pl-10", // Add padding-left if startIcon exists
          className
        )}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => setHasValue(e.target.value !== "")}
        {...props}
      />
      {type === "date" && (
        <div className="absolute left-[175px] text-muted-foreground pointer-events-none">
          {props.placeholder}
        </div>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
