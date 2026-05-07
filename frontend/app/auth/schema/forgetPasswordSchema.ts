import { z } from "zod";

export const forgetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;