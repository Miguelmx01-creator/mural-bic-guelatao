const TOKEN_STORAGE_KEY = 'mural-comment-tokens';
const AUTHOR_STORAGE_KEY = 'mural-comment-author';

function readTokens(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

export function saveCommentToken(commentId: string, token: string): void {
  if (typeof window === 'undefined') return;
  const map = readTokens();
  map[commentId] = token;
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(map));
}

export function getCommentToken(commentId: string): string | null {
  return readTokens()[commentId] ?? null;
}

export function canEditComment(commentId: string): boolean {
  return Boolean(getCommentToken(commentId));
}

export function getSavedAuthorName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AUTHOR_STORAGE_KEY) ?? '';
}

export function saveAuthorName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTHOR_STORAGE_KEY, name.trim());
}

export function generateEditToken(): string {
  return crypto.randomUUID();
}
