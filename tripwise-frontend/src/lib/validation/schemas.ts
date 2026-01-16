import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Step 1: Basic Info Schema
export const basicInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  whatsappNumber: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number'),
  email: z
    .string()
    .regex(emailRegex, 'Please enter a valid email address'),
  cityOfDeparture: z
    .string()
    .min(2, 'City must be at least 2 characters'),
  adults: z
    .number()
    .min(1, 'At least 1 adult is required')
    .max(20, 'Maximum 20 adults allowed'),
  children: z
    .array(z.number().min(2).max(17))
    .optional()
    .default([]),
  infants: z
    .number()
    .min(0, 'Infants cannot be negative')
    .max(10, 'Maximum 10 infants allowed')
    .default(0),
});

// Step 2: Dates Schema
export const datesSchema = z.object({
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Start date cannot be in the past'),
  returnDate: z
    .string()
    .min(1, 'Return date is required'),
  duration: z
    .number()
    .min(1, 'Duration must be at least 1 day'),
  isFlexible: z
    .boolean()
    .default(false),
}).refine((data) => {
  if (data.startDate && data.returnDate) {
    return new Date(data.returnDate) > new Date(data.startDate);
  }
  return true;
}, {
  message: 'Return date must be after start date',
  path: ['returnDate'],
});

// Step 3: Destination Schema
export const destinationSchema = z.object({
  destination: z
    .string()
    .optional()
    .default(''),
  travelType: z
    .enum(['domestic', 'international'], {
      required_error: 'Please select travel type',
    }),
  preferenceType: z
    .enum(['mountains', 'beach', 'city', 'spiritual', 'adventure'])
    .optional(),
  isFirstVisit: z
    .boolean()
    .nullable()
    .optional(),
});

// Step 4: Budget Schema
export const budgetSchema = z.object({
  level: z
    .enum(['low', 'medium', 'premium', 'luxury'], {
      required_error: 'Please select budget level',
    }),
  includesFlights: z
    .enum(['yes', 'no', 'not-sure'], {
      required_error: 'Please select flight preference',
    }),
});

// Step 5: Accommodation Schema
export const accommodationSchema = z.object({
  category: z
    .enum(['budget', 'mid-range', 'luxury', 'resort', 'homestay'], {
      required_error: 'Please select accommodation category',
    }),
  roomType: z
    .enum(['single', 'double', 'twin', 'family', 'dorm'], {
      required_error: 'Please select room type',
    }),
  specialNeeds: z
    .array(z.string())
    .optional()
    .default([]),
});

// Step 6: Transport Schema
export const transportSchema = z.object({
  mode: z
    .enum(['flight', 'train', 'bus', 'own-vehicle'], {
      required_error: 'Please select transport mode',
    }),
  timingPreference: z
    .string()
    .min(1, 'Timing preference is required'),
  pickupDrop: z
    .boolean()
    .default(false),
});

// Step 7: Purpose Schema
export const purposeSchema = z.object({
  purpose: z
    .enum(['vacation', 'honeymoon', 'family', 'solo', 'business', 'religious'], {
      required_error: 'Please select travel purpose',
    }),
  specialOccasion: z
    .string()
    .optional()
    .default(''),
});

// Step 8: Interests Schema
export const interestsSchema = z.object({
  sightseeing: z.boolean().default(false),
  relaxation: z.boolean().default(false),
  adventure: z.boolean().default(false),
  shopping: z.boolean().default(false),
  nature: z.boolean().default(false),
  food: z.boolean().default(false),
}).refine((data) => {
  const selectedInterests = Object.values(data).filter(Boolean);
  return selectedInterests.length >= 1 && selectedInterests.length <= 4;
}, {
  message: 'Please select between 1 and 4 interests',
});

// Step 9: Food Schema
export const foodSchema = z.object({
  type: z
    .enum(['veg', 'non-veg', 'both'], {
      required_error: 'Please select food preference',
    }),
  allergies: z
    .string()
    .optional()
    .default(''),
});

// Step 10: Documents Schema
export const documentsSchema = z.object({
  hasPassport: z
    .boolean(),
  passportExpiry: z
    .string()
    .optional(),
  visaAwareness: z
    .enum(['yes', 'no', 'not-sure'], {
      required_error: 'Please select visa awareness',
    }),
}).refine((data) => {
  if (data.hasPassport && data.passportExpiry) {
    const expiryDate = new Date(data.passportExpiry);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return expiryDate > sixMonthsFromNow;
  }
  return true;
}, {
  message: 'Passport must be valid for at least 6 months',
  path: ['passportExpiry'],
});

// Step 11: Experience Schema
export const experienceSchema = z.object({
  frequency: z
    .enum(['never', 'sometimes', 'frequent'])
    .optional(),
  badExperiences: z
    .string()
    .optional()
    .default(''),
});

// Step 12: Communication Schema
export const communicationSchema = z.object({
  method: z
    .enum(['whatsapp', 'call', 'email'], {
      required_error: 'Please select communication method',
    }),
  bestTime: z
    .enum(['morning', 'afternoon', 'evening', 'any-time'], {
      required_error: 'Please select best time to contact',
    }),
});

// Export all schemas for easy import
export const stepSchemas = {
  basicInfo: basicInfoSchema,
  dates: datesSchema,
  destination: destinationSchema,
  budget: budgetSchema,
  accommodation: accommodationSchema,
  transport: transportSchema,
  purpose: purposeSchema,
  interests: interestsSchema,
  food: foodSchema,
  documents: documentsSchema,
  experience: experienceSchema,
  communication: communicationSchema,
} as const;

// Type exports for use in components
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type DatesFormData = z.infer<typeof datesSchema>;
export type DestinationFormData = z.infer<typeof destinationSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
export type AccommodationFormData = z.infer<typeof accommodationSchema>;
export type TransportFormData = z.infer<typeof transportSchema>;
export type PurposeFormData = z.infer<typeof purposeSchema>;
export type InterestsFormData = z.infer<typeof interestsSchema>;
export type FoodFormData = z.infer<typeof foodSchema>;
export type DocumentsFormData = z.infer<typeof documentsSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type CommunicationFormData = z.infer<typeof communicationSchema>;

// Union type for all step data
export type StepFormData = 
  | BasicInfoFormData
  | DatesFormData
  | DestinationFormData
  | BudgetFormData
  | AccommodationFormData
  | TransportFormData
  | PurposeFormData
  | InterestsFormData
  | FoodFormData
  | DocumentsFormData
  | ExperienceFormData
  | CommunicationFormData;

// Step ID type
export type StepId = keyof typeof stepSchemas;
