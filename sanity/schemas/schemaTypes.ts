/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MINIMAL SCHEMA TYPES
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Why this file exists instead of importing `defineType` from 'sanity':
 *
 *  The `sanity` package is the Studio — roughly 200 MB of editor UI that this
 *  website never imports at runtime. Adding it as a dependency would make every
 *  `npm install` pay for a CMS you might not switch on.
 *
 *  Sanity accepts plain objects for schema definitions; `defineType` is purely
 *  a TypeScript helper that adds autocomplete. So the schemas in this folder
 *  are plain objects typed against the interfaces below, and they are valid
 *  Sanity schemas exactly as written.
 *
 *  IF YOU WANT THE STUDIO
 *  ──────────────────────
 *  Run `npm install --save-dev sanity @sanity/vision styled-components`, then
 *  optionally wrap each export in `defineType(...)` for richer autocomplete.
 *  The schema objects themselves need no changes.
 */

/** A field inside a document or object type. */
export interface SchemaField {
  name: string;
  title?: string;
  type: string;
  description?: string;
  /** Nested fields, for `object` types. */
  fields?: SchemaField[];
  /** Member type, for `array` types. */
  of?: Array<{ type: string; name?: string; fields?: SchemaField[]; to?: Array<{ type: string }> }>;
  options?: Record<string, unknown>;
  initialValue?: unknown;
  readOnly?: boolean;
  hidden?: boolean;
  /** Textarea height, for `text` fields. */
  rows?: number;
  /** Validation rule builder. Typed loosely because the Rule API lives in the
   *  Studio package we are deliberately not importing. */
  validation?: (rule: ValidationRule) => unknown;
  fieldset?: string;
  group?: string;
}

/** The subset of Sanity's validation Rule API used by these schemas. */
export interface ValidationRule {
  required(): ValidationRule;
  min(n: number): ValidationRule;
  max(n: number): ValidationRule;
  integer(): ValidationRule;
  positive(): ValidationRule;
  email(): ValidationRule;
  uri(options?: { scheme?: string[]; allowRelative?: boolean }): ValidationRule;
  error(message?: string): ValidationRule;
  warning(message?: string): ValidationRule;
  custom(fn: (value: unknown) => true | string): ValidationRule;
}

/** A top-level document or object schema definition. */
export interface SchemaType {
  name: string;
  title: string;
  type: 'document' | 'object';
  description?: string;
  fields: SchemaField[];
  preview?: {
    select: Record<string, string>;
    prepare?: (selection: Record<string, unknown>) => {
      title?: string;
      subtitle?: string;
      media?: unknown;
    };
  };
  orderings?: Array<{
    title: string;
    name: string;
    by: Array<{ field: string; direction: 'asc' | 'desc' }>;
  }>;
}
