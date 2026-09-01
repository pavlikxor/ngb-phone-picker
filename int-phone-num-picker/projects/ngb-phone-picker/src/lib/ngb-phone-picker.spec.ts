import { ComponentFixture, TestBed } from '@angular/core/testing';

import { buildHighlightedSegments, NgbPhonePicker } from './ngb-phone-picker';

describe('NgbPhonePicker', () => {
  let component: NgbPhonePicker;
  let fixture: ComponentFixture<NgbPhonePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbPhonePicker],
    }).compileComponents();

    fixture = TestBed.createComponent(NgbPhonePicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should highlight matching segments case-insensitively', () => {
    const segments = buildHighlightedSegments('Canada', 'an');

    expect(segments).toEqual([
      { text: 'C', isMatch: false },
      { text: 'an', isMatch: true },
      { text: 'ada', isMatch: false },
    ]);
  });

  it('should leave text untouched when there is no query', () => {
    const segments = buildHighlightedSegments('Canada', '   ');

    expect(segments).toEqual([{ text: 'Canada', isMatch: false }]);
  });
});
