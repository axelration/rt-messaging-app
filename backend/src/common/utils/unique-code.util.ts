const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export default function generateUnique(): string {
  let result = '';

  for (let i = 0; i < 8; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }

  return `${result.slice(0, 4)}-${result.slice(4)}`;
}
