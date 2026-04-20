/**
 * Lightweight input validation for auth & user-supplied strings.
 * Avoids a regex-heavy zod dep by keeping this tight and purposeful.
 */

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

// Pragmatic email regex: not RFC 5322-compliant, but rejects the obvious
// garbage and matches real-world providers. Final authority is Supabase.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(raw: string): ValidationResult {
  const email = raw.trim();
  if (!email) return { valid: false, reason: 'Email is required.' };
  if (email.length > 254) return { valid: false, reason: 'Email is too long.' };
  if (!EMAIL_RE.test(email)) return { valid: false, reason: 'Please enter a valid email address.' };
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, reason: 'Password is required.' };
  if (password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters.' };
  }
  if (password.length > 128) {
    return { valid: false, reason: 'Password is too long.' };
  }
  // Require at least one letter and one digit. Not overly strict — this
  // catches obviously weak passwords without frustrating legitimate users.
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return {
      valid: false,
      reason: 'Password must include at least one letter and one number.',
    };
  }
  return { valid: true };
}

export function validateDisplayName(raw: string): ValidationResult {
  const name = raw.trim();
  if (!name) return { valid: false, reason: 'Name is required.' };
  if (name.length > 80) return { valid: false, reason: 'Name is too long (80 chars max).' };
  // Control characters should never appear in a display name.
  if (/[\x00-\x1F\x7F]/.test(name)) {
    return { valid: false, reason: 'Name contains invalid characters.' };
  }
  return { valid: true };
}

/** Clamp free-text notes (user reflections etc.) to a safe length. */
export function clampNotes(raw: string, max = 500): string {
  const stripped = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return stripped.length > max ? stripped.slice(0, max) : stripped;
}
