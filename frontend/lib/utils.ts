import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─────────────────────────────────────────────────────────────
//  utils.ts
//  The classic shadcn/ui utility — merges Tailwind classes
//  without conflicts. Used throughout all components.
//
//  Example:
//    cn("px-4 py-2", isActive && "bg-brand-600", className)
// ─────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
