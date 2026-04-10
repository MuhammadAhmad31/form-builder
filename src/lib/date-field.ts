import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import type { DateValue } from "reka-ui";

export const defaultDatePlaceholder = today(getLocalTimeZone());

export function parseStoredDate(value?: string): DateValue | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return parseDate(value);
  } catch {
    return undefined;
  }
}

export function formatStoredDate(value?: string): string {
  if (!value) {
    return "Pick a date";
  }

  const parsed = parseStoredDate(value);
  if (!parsed) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(parsed.year, parsed.month - 1, parsed.day));
}

export function toStoredDate(value: DateValue | undefined): string {
  return value ? value.toString() : "";
}
