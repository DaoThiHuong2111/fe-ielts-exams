import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import databaseSchema from '@/data/schemas/database-schema.json';

// Initialize AJV with options
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: false,
  validateFormats: true,
});

// Add format validators (for uri, date-time, etc.)
addFormats(ajv);

// Add the schema with definitions
ajv.addSchema(databaseSchema, 'database-schema');

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors?: ErrorObject[];
  formattedErrors?: string[];
}

/**
 * Format AJV errors into readable messages
 */
function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) return [];
  
  return errors.map(error => {
    const field = error.instancePath || 'root';
    const message = error.message || 'Unknown error';
    
    switch (error.keyword) {
      case 'required':
        return `Field '${field}' is missing required property: ${error.params.missingProperty}`;
      case 'type':
        return `Field '${field}' must be of type ${error.params.type}`;
      case 'enum':
        return `Field '${field}' must be one of: ${error.params.allowedValues?.join(', ')}`;
      case 'minLength':
        return `Field '${field}' must be at least ${error.params.limit} characters`;
      case 'maxLength':
        return `Field '${field}' must not exceed ${error.params.limit} characters`;
      case 'minimum':
        return `Field '${field}' must be at least ${error.params.limit}`;
      case 'maximum':
        return `Field '${field}' must not exceed ${error.params.limit}`;
      case 'minItems':
        return `Field '${field}' must contain at least ${error.params.limit} items`;
      case 'maxItems':
        return `Field '${field}' must not contain more than ${error.params.limit} items`;
      case 'pattern':
        return `Field '${field}' does not match required pattern: ${error.params.pattern}`;
      case 'format':
        return `Field '${field}' does not match required format: ${error.params.format}`;
      case 'const':
        return `Field '${field}' must be exactly: ${error.params.allowedValue}`;
      case 'uniqueItems':
        return `Field '${field}' must contain unique items`;
      default:
        return `Field '${field}': ${message}`;
    }
  });
}

/**
 * Validate a Question (MultipleChoiceQuestion or FillInBlanksQuestion)
 */
export function validateQuestion(question: unknown): ValidationResult {
  const validator = ajv.compile({ $ref: 'database-schema#/definitions/Question' });
  const valid = validator(question);
  
  return {
    valid,
    errors: validator.errors || undefined,
    formattedErrors: !valid ? formatErrors(validator.errors) : undefined,
  };
}

/**
 * Validate a PassageWithQuestions
 */
export function validatePassageWithQuestions(passage: unknown): ValidationResult {
  const validator = ajv.compile({ $ref: 'database-schema#/definitions/PassageWithQuestions' });
  const valid = validator(passage);
  
  return {
    valid,
    errors: validator.errors || undefined,
    formattedErrors: !valid ? formatErrors(validator.errors) : undefined,
  };
}

/**
 * Validate QuizStorageData (root storage structure)
 */
export function validateQuizStorageData(data: unknown): ValidationResult {
  const validator = ajv.compile({ $ref: 'database-schema#/definitions/QuizStorageData' });
  const valid = validator(data);
  
  return {
    valid,
    errors: validator.errors || undefined,
    formattedErrors: !valid ? formatErrors(validator.errors) : undefined,
  };
}

/**
 * Validate a QuizSession
 */
export function validateQuizSession(session: unknown): ValidationResult {
  const validator = ajv.compile({ $ref: 'database-schema#/definitions/QuizSession' });
  const valid = validator(session);
  
  return {
    valid,
    errors: validator.errors || undefined,
    formattedErrors: !valid ? formatErrors(validator.errors) : undefined,
  };
}

/**
 * Validate a QuizResult
 */
export function validateQuizResult(result: unknown): ValidationResult {
  const validator = ajv.compile({ $ref: 'database-schema#/definitions/QuizResult' });
  const valid = validator(result);
  
  return {
    valid,
    errors: validator.errors || undefined,
    formattedErrors: !valid ? formatErrors(validator.errors) : undefined,
  };
}

/**
 * Validate a QuizAnswer (MultipleChoiceAnswer or FillInBlanksAnswer)
 */
export function validateQuizAnswer(answer: unknown): ValidationResult {
  const validator = ajv.compile({ $ref: 'database-schema#/definitions/QuizAnswer' });
  const valid = validator(answer);
  
  return {
    valid,
    errors: validator.errors || undefined,
    formattedErrors: !valid ? formatErrors(validator.errors) : undefined,
  };
}

/**
 * Validate Legacy Quiz Data (for backwards compatibility)
 */
export function validateLegacyQuizData(data: unknown): ValidationResult {
  const validator = ajv.compile({ $ref: 'database-schema#/definitions/LegacyQuizData' });
  const valid = validator(data);
  
  return {
    valid,
    errors: validator.errors || undefined,
    formattedErrors: !valid ? formatErrors(validator.errors) : undefined,
  };
}

/**
 * BACKWARDS COMPATIBILITY - Keep old function names
 */
export const validateQuizSet = validateLegacyQuizData;

/**
 * Get supported question types
 */
export function getSupportedQuestionTypes(): string[] {
  return [
    'multiple-choice',
    'fill-in-blanks',
  ];
}

/**
 * Check if a question type is supported
 */
export function isQuestionTypeSupported(type: string): boolean {
  return getSupportedQuestionTypes().includes(type);
}

export default {
  validateQuestion,
  validatePassageWithQuestions,
  validateQuizStorageData,
  validateQuizSession,
  validateQuizResult,
  validateQuizAnswer,
  validateLegacyQuizData,
  validateQuizSet, // Backwards compatibility
  getSupportedQuestionTypes,
  isQuestionTypeSupported,
};
