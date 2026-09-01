import { describe, expect, it } from 'vitest';

import { buildHighlightedSegments } from '../projects/ngb-phone-picker/src/lib/ngb-phone-picker';

describe('buildHighlightedSegments', () => {
  it('highlights the match case-insensitively', () => {
    expect(buildHighlightedSegments('Canada', 'an')).toEqual([
      { text: 'C', isMatch: false },
      { text: 'an', isMatch: true },
      { text: 'ada', isMatch: false },
    ]);
  });

  it('returns the original text when the query is blank', () => {
    expect(buildHighlightedSegments('Canada', '   ')).toEqual([
      { text: 'Canada', isMatch: false },
    ]);
  });

  it('escapes regex characters in the query', () => {
    expect(buildHighlightedSegments('a+b', '+b')).toEqual([
      { text: 'a', isMatch: false },
      { text: '+b', isMatch: true },
    ]);
  });
});
