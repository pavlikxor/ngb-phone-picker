export function buildPhoneValidationMessage(
  countryName: string | undefined,
  value: string | undefined,
): string {
  const normalizedCountryName = countryName?.trim() || 'the selected country';
  const trimmedValue = value?.trim() ?? '';

  if (!trimmedValue) {
    return 'Please enter a phone number.';
  }

  if (!/^[0-9\- ]+$/.test(trimmedValue)) {
    return 'Use only numbers, spaces, and dashes.';
  }

  return `Please enter a valid phone number for ${normalizedCountryName}.`;
}
