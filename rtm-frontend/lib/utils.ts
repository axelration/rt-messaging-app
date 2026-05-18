import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isEmailValid(email: string) {
  // Simple email validation: check for presence of "@" and ".", and ensure they are not at the end of the string
  return email.trim() !== '' && email.includes('@') && email.includes('.') && !email.endsWith('@') && !email.endsWith('.');
}