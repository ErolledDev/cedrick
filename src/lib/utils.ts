import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_DOMAIN = "sharklasers.com";

export const AVAILABLE_DOMAINS = [
  DEFAULT_DOMAIN,
  "guerrillamailblock.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "grr.la",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "pokemail.net",
  "spam.me"
];

export function getRandomDomain() {
  return DEFAULT_DOMAIN; // Always return sharklasers.com as default
}

export function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}