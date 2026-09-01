import '@angular/compiler';

import { describe, expect, it } from 'vitest';

import { buildHighlightedSegments } from './ngb-phone-picker';
import { buildPhoneValidationMessage } from './phone-validation';

describe('buildPhoneValidationMessage', () => {
  it('uses friendly wording for invalid character input', () => {
    expect(buildPhoneValidationMessage('United States', '123+456')).toBe(
      'Use only numbers, spaces, and dashes.',
    );
  });

  it('uses a friendly message when the phone number is invalid for the selected country', () => {
    expect(buildPhoneValidationMessage('United States', '123')).toBe(
      'Please enter a valid phone number for United States.',
    );
  });
});

describe('buildHighlightedSegments', () => {
  it('highlights the matching segment case-insensitively', () => {
    expect(buildHighlightedSegments('Canada', 'an')).toEqual([
      { text: 'C', isMatch: false },
      { text: 'an', isMatch: true },
      { text: 'ada', isMatch: false },
    ]);
  });

  it('leaves the text unchanged when the query is empty', () => {
    expect(buildHighlightedSegments('Canada', '   ')).toEqual([
      { text: 'Canada', isMatch: false },
    ]);
  });

  it('escapes special regex characters in the query', () => {
    expect(buildHighlightedSegments('a+b', '+b')).toEqual([
      { text: 'a', isMatch: false },
      { text: '+b', isMatch: true },
    ]);
  });
});

