import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-gray-500 focus-visible:border-gray-950 focus-visible:ring-gray-950/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] disabled:opacity-50 disabled:cursor-not-allowed md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
