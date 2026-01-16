import { z } from 'zod';
import { stepSchemas, StepId } from './schemas';
import { TravelerProfile } from '@/store/profileStore';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Step validation result with field-level errors
export interface StepValidationResult extends ValidationResult {
  fieldErrors: Record<string, string>;
}

// Completion status interface
export interface CompletionStatus {
  completed: number;
  total: number;
  percentage: number;
  completedSteps: StepId[];
  incompleteSteps: StepId[];
}

// Required fields mapping for each step
const requiredFieldsMap: Record<StepId, string[]> = {
  basicInfo: ['fullName', 'whatsappNumber', 'email', 'cityOfDeparture', 'adults'],
  dates: ['startDate', 'returnDate', 'duration'],
  destination: ['travelType'],
  budget: ['level', 'includesFlights'],
  accommodation: ['category', 'roomType'],
  transport: ['mode', 'timingPreference'],
  purpose: ['purpose'],
  interests: [], // Interests are validated differently (1-4 selections)
  food: ['type'],
  documents: ['hasPassport', 'visaAwareness'],
  experience: [], // Experience is optional
  communication: ['method', 'bestTime'],
};

/**
 * Validate a specific step's data
 */
export function validateStep(stepId: StepId, data: unknown): ValidationResult {
  const schema = stepSchemas[stepId];
  
  try {
    schema.parse(data);
    return {
      isValid: true,
      errors: {},
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      
      return {
        isValid: false,
        errors,
      };
    }
    
    return {
      isValid: false,
      errors: { _form: 'Validation failed' },
    };
  }
}

/**
 * Validate a step with detailed field-level errors
 */
export function validateStepDetailed(stepId: StepId, data: unknown): StepValidationResult {
  const schema = stepSchemas[stepId];
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      isValid: true,
      errors: {},
      fieldErrors: {},
    };
  }
  
  const errors: Record<string, string> = {};
  const fieldErrors: Record<string, string> = {};
  
  result.error.errors.forEach((err) => {
    const field = err.path.join('.');
    errors[field] = err.message;
    fieldErrors[field] = err.message;
  });
  
  return {
    isValid: false,
    errors,
    fieldErrors,
  };
}

/**
 * Check if user can proceed to next step
 */
export function canProceedToNext(stepId: StepId, profileData: Partial<TravelerProfile>): boolean {
  // Get the data for the current step
  const stepData = getStepData(stepId, profileData);
  
  if (!stepData) {
    return false;
  }
  
  const validation = validateStep(stepId, stepData);
  return validation.isValid;
}

/**
 * Get required fields for a step
 */
export function getRequiredFields(stepId: StepId): string[] {
  return requiredFieldsMap[stepId] || [];
}

/**
 * Get completion status for the entire profile
 */
export function getCompletionStatus(profileData: Partial<TravelerProfile>): CompletionStatus {
  const steps: StepId[] = Object.keys(stepSchemas) as StepId[];
  let completed = 0;
  const completedSteps: StepId[] = [];
  const incompleteSteps: StepId[] = [];
  
  steps.forEach((stepId) => {
    const stepData = getStepData(stepId, profileData);
    
    if (stepData && canProceedToNext(stepId, profileData)) {
      completed++;
      completedSteps.push(stepId);
    } else {
      incompleteSteps.push(stepId);
    }
  });
  
  const percentage = Math.round((completed / steps.length) * 100);
  
  return {
    completed,
    total: steps.length,
    percentage,
    completedSteps,
    incompleteSteps,
  };
}

/**
 * Get step data from profile
 */
function getStepData(stepId: StepId, profileData: Partial<TravelerProfile>): unknown {
  const stepMapping: Record<StepId, keyof Omit<TravelerProfile, 'profileId' | 'currentStep' | 'isLoading' | 'isSyncing' | 'error' | 'lastSavedAt'>> = {
    basicInfo: 'basicInfo',
    dates: 'dates',
    destination: 'destination',
    budget: 'budget',
    accommodation: 'accommodation',
    transport: 'transport',
    purpose: 'purpose',
    interests: 'interests',
    food: 'food',
    documents: 'documents',
    experience: 'experience',
    communication: 'communication',
  };
  
  const stateKey = stepMapping[stepId];
  return stateKey ? profileData[stateKey] : null;
}

/**
 * Check if a step has any data (not necessarily complete)
 */
export function hasStepData(stepId: StepId, profileData: Partial<TravelerProfile>): boolean {
  const stepData = getStepData(stepId, profileData);
  
  if (!stepData) {
    return false;
  }
  
  // Check if any field has a non-empty value
  if (typeof stepData === 'object' && stepData !== null) {
    return Object.values(stepData).some(value => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value > 0;
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    });
  }
  
  return Boolean(stepData);
}

/**
 * Get next incomplete step
 */
export function getNextIncompleteStep(profileData: Partial<TravelerProfile>): StepId | null {
  const steps: StepId[] = Object.keys(stepSchemas) as StepId[];
  
  for (const stepId of steps) {
    if (!canProceedToNext(stepId, profileData)) {
      return stepId;
    }
  }
  
  return null; // All steps complete
}

/**
 * Get first incomplete step (starting from basicInfo)
 */
export function getFirstIncompleteStep(profileData: Partial<TravelerProfile>): StepId | null {
  const steps: StepId[] = Object.keys(stepSchemas) as StepId[];
  
  for (const stepId of steps) {
    if (!hasStepData(stepId, profileData) || !canProceedToNext(stepId, profileData)) {
      return stepId;
    }
  }
  
  return null; // All steps complete
}

/**
 * Validate all steps and return overall status
 */
export function validateAllSteps(profileData: Partial<TravelerProfile>): {
  isValid: boolean;
  stepResults: Record<StepId, ValidationResult>;
  overallErrors: string[];
} {
  const steps: StepId[] = Object.keys(stepSchemas) as StepId[];
  const stepResults: Record<StepId, ValidationResult> = {} as Record<StepId, ValidationResult>;
  const overallErrors: string[] = [];
  let isValid = true;
  
  steps.forEach((stepId) => {
    const stepData = getStepData(stepId, profileData);
    const result = validateStep(stepId, stepData);
    stepResults[stepId] = result;
    
    if (!result.isValid) {
      isValid = false;
      overallErrors.push(`Step ${stepId}: ${Object.values(result.errors).join(', ')}`);
    }
  });
  
  return {
    isValid,
    stepResults,
    overallErrors,
  };
}

/**
 * Get step number from step ID
 */
export function getStepNumber(stepId: StepId): number {
  const steps: StepId[] = Object.keys(stepSchemas) as StepId[];
  return steps.indexOf(stepId) + 1;
}

/**
 * Get step ID from step number
 */
export function getStepId(stepNumber: number): StepId | null {
  const steps: StepId[] = Object.keys(stepSchemas) as StepId[];
  return steps[stepNumber - 1] || null;
}
