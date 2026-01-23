export function isValidSlug(slug: string): boolean {
  // URL-friendly: lowercase letters, numbers, hyphens, underscores
  return /^[a-z0-9_-]+$/.test(slug);
}

export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug) {
    return { valid: false, error: "Slug is required" };
  }
  if (!isValidSlug(slug)) {
    return {
      valid: false,
      error: "Slug must contain only lowercase letters, numbers, hyphens, and underscores",
    };
  }
  if (slug.length > 100) {
    return { valid: false, error: "Slug must be 100 characters or less" };
  }
  return { valid: true };
}

export function validateAge(age: number | null | undefined): { valid: boolean; error?: string } {
  if (age === null || age === undefined) {
    return { valid: true }; // Age is optional
  }
  if (!Number.isInteger(age) || age < 0 || age > 150) {
    return { valid: false, error: "Age must be a positive integer between 0 and 150" };
  }
  return { valid: true };
}

export function validateFileSize(file: File, maxSizeMB: number = 50): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }
  return { valid: true };
}

export function validateFileType(
  file: File,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateUrl(url: string | null | undefined): { valid: boolean; error?: string } {
  if (url === null || url === undefined || url === "") {
    return { valid: true }; // URL is optional
  }
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}
