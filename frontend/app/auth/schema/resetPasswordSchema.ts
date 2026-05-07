import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;