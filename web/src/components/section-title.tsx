import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface SectionTitleProps extends ComponentProps<"h3"> {}

export function SectionTitle({ className, ...props }: SectionTitleProps) {
  return (
    <div>
      <h3
        className={twMerge("text-base font-semibold text-zinc-100", className)}
        {...props}
      />
    </div>
  );
}
