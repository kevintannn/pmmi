import { z } from 'zod';

// -----------------------------------------------------------------------------
// Contact / inquiry form
// -----------------------------------------------------------------------------
export const inquirySchema = z.object({
  name: z.string().min(2, 'Name is too short').max(120),
  email: z.string().email('Invalid email address'),
  company: z.string().max(160).optional().or(z.literal('')),
  country: z.string().max(80).optional().or(z.literal('')),
  message: z.string().min(10, 'Please provide a few more details').max(4000),
});
export type InquiryInput = z.infer<typeof inquirySchema>;

// -----------------------------------------------------------------------------
// Job application form
// -----------------------------------------------------------------------------
export const applicationSchema = z.object({
  careerId: z.string().optional().or(z.literal('')),
  name: z.string().min(2, 'Name is too short').max(120),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Invalid phone number').max(40),
  // Relative path (e.g. "/uploads/abc.pdf") from our own upload endpoint, or a
  // full URL — not validated as a strict URL so relative paths are accepted.
  resumeUrl: z.string().max(1000).optional().or(z.literal('')),
  coverLetter: z.string().max(6000).optional().or(z.literal('')),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

// -----------------------------------------------------------------------------
// Admin: scrap price
// -----------------------------------------------------------------------------
export const scrapPriceSchema = z.object({
  date: z.string().min(1, 'Date is required'), // YYYY-MM-DD
  category: z.string().min(1, 'Category is required').max(80),
  price: z.coerce.number().positive('Price must be positive'),
  currency: z.string().min(1).max(8).default('USD'),
  notes: z.string().max(500).optional().or(z.literal('')),
});
export type ScrapPriceInput = z.infer<typeof scrapPriceSchema>;

// -----------------------------------------------------------------------------
// Admin: career posting
// -----------------------------------------------------------------------------
export const employmentTypeEnum = z.enum([
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
]);
export const careerStatusEnum = z.enum(['OPEN', 'CLOSED']);

export const careerSchema = z.object({
  position: z.string().min(2).max(160),
  department: z.string().min(2).max(120),
  location: z.string().min(2).max(160),
  employmentType: employmentTypeEnum.default('FULL_TIME'),
  description: z.string().min(10).max(6000),
  status: careerStatusEnum.default('OPEN'),
});
export type CareerInput = z.infer<typeof careerSchema>;
