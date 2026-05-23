import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DAY_IN_MS = 86400000;

export function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const r = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return Math.round((r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 10) / 10;
}

export function calculateSmartScore(
  dist: number, responseSpeed: number, activeDaysAgo: number, freq: number
): number {
  return dist + (responseSpeed * 0.1) + (activeDaysAgo * 0.5) - (freq * 0.2);
}

export function isEligible(lastDonationMs: number): boolean {
  return (Date.now() - lastDonationMs) > 90 * DAY_IN_MS;
}

export function formatFullDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(new Date(timestamp));
}
