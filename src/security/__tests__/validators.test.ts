import {
  validateEmail,
  validatePassword,
  validateDisplayName,
  clampNotes,
} from '../validators';

describe('validators', () => {
  test('email', () => {
    expect(validateEmail('a@b.co').valid).toBe(true);
    expect(validateEmail('  user@example.com  ').valid).toBe(true);
    expect(validateEmail('').valid).toBe(false);
    expect(validateEmail('no-at-sign').valid).toBe(false);
    expect(validateEmail('a@b').valid).toBe(false);
    const long = 'a'.repeat(255) + '@x.co';
    expect(validateEmail(long).valid).toBe(false);
  });

  test('password requires ≥8 chars with letter + digit', () => {
    expect(validatePassword('').valid).toBe(false);
    expect(validatePassword('short1a').valid).toBe(false);
    expect(validatePassword('alllowerletters').valid).toBe(false);
    expect(validatePassword('12345678').valid).toBe(false);
    expect(validatePassword('Passw0rd').valid).toBe(true);
  });

  test('display name clamps and rejects control chars', () => {
    expect(validateDisplayName('').valid).toBe(false);
    expect(validateDisplayName('Aaron').valid).toBe(true);
    expect(validateDisplayName('a'.repeat(81)).valid).toBe(false);
    expect(validateDisplayName('bad\x00name').valid).toBe(false);
  });

  test('clampNotes trims and strips control chars', () => {
    expect(clampNotes('hello\x00world')).toBe('helloworld');
    expect(clampNotes('a'.repeat(600)).length).toBe(500);
  });
});
