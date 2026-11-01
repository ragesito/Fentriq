import { z } from "zod";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s().-]{7,20}$/;

export function isEmail(value: string): boolean {
  return EMAIL.test(value);
}

/**
 * Shared contact-form schema (used on both the client and the server).
 * `contact` is whatever the visitor wants a reply on: a phone or an email.
 * `website` is a honeypot field — real users never fill it.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  contact: z
    .string()
    .trim()
    .max(200)
    .refine((value) => EMAIL.test(value) || PHONE.test(value)),
  message: z.string().trim().min(3).max(4000),
  locale: z.string().min(2).max(5).optional(),
  // Honeypot: accepted by the schema so the server can silently discard bots
  // (rather than returning a validation error that signals the trap).
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
