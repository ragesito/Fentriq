import { z } from "zod";

/**
 * Shared contact-form schema (used on both the client and the server).
 * `website` is a honeypot field — real users never fill it.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "name" }).max(120),
  email: z.email({ message: "email" }).max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(10, { message: "message" }).max(4000),
  budget: z.string().max(40).optional().or(z.literal("")),
  consent: z.literal(true, { message: "consent" }),
  locale: z.string().min(2).max(5).optional(),
  // Honeypot: accepted by the schema so the server can silently discard bots
  // (rather than returning a validation error that signals the trap).
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const budgetOptions = ["<5k", "5-15k", "15-30k", ">30k", "?"] as const;
