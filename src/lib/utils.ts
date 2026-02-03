import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDisplayName(fullName: string | null | undefined) {
  if (!fullName) return "Member";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0] || "Member";

  const firstPart = parts[0].toLowerCase();
  const prefixes = ["muhammed", "mohammed", "muhammad", "mohamed", "md", "md."];

  if (prefixes.includes(firstPart)) {
    // If it's just the prefix + one name, return that name
    // If it's prefix + multiple names, return the first "main" name
    return parts[1];
  }

  return parts[0];
}
