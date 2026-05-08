// schema/registerSchema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  emailId: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  phoneNumber: z.string().optional(),
  
  // Business Information
  companyName: z.string().min(1, 'Business name is required'),
  companyWebsite: z.string().url('Invalid website URL').optional().or(z.literal('')),
  logo: z.any().optional(),
  
  // Address Information
  companyAddress: z.string().min(1, 'Street address is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'ZIP/Postal code is required'),
  suiteNumber: z.string().optional(),
  landmark: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  showDetailedAddress: z.boolean().optional(),
  
  // Branding Colors
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').default('#1e293b'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').default('#3b82f6'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').default('#8b5cf6'),
  
  // Security
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  termsSelected: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;