import '@angular/compiler';

import { describe, expect, it } from 'vitest';

import {
  buildHighlightedSegments,
  resolvePhoneValue,
} from './ngb-phone-picker';

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

describe('resolvePhoneValue', () => {
  it('returns a parsed value when the selected country and phone number are valid', () => {
    expect(
      resolvePhoneValue(
        { countryCode: 45, prefix: 'DK', countryName: 'Denmark' },
        '26668888',
      ),
    ).toEqual({
      countryCode: 45,
      phoneNumber: '26668888',
    });
  });

  it('returns null when the selected country and phone number are invalid', () => {
    expect(
      resolvePhoneValue(
        { countryCode: 1, prefix: 'US', countryName: 'United States' },
        '123',
      ),
    ).toBeNull();
  });

  it('returns null when no country and no phone are selected', () => {
    expect(resolvePhoneValue(undefined, '')).toBeNull();
  });
});

