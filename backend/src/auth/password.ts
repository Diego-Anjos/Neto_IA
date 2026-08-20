import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const HASH_PREFIX = 'scrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${HASH_PREFIX}$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export function isHashedPassword(stored: string): boolean {
  return stored.startsWith(`${HASH_PREFIX}$`);
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  if (!isHashedPassword(stored)) {
    const provided = Buffer.from(password);
    const expected = Buffer.from(stored);
    return (
      provided.length === expected.length && timingSafeEqual(provided, expected)
    );
  }

  const [, saltHex, hashHex] = stored.split('$');
  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const derived = (await scrypt(password, salt, expected.length)) as Buffer;

  return (
    derived.length === expected.length && timingSafeEqual(derived, expected)
  );
}
