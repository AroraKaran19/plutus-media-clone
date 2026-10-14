import { z } from "zod";

export const profileSchema = z
  .object({
    name: z.string().min(1).max(80).optional(),
    email: z.email().optional(),
  })
  .refine((v) => v.name !== undefined || v.email !== undefined, {
    message: "Provide a name or an email to update",
  });

export const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
