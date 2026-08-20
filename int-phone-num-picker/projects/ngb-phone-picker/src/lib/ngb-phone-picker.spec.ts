import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbPhonePicker } from './ngb-phone-picker';

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
});
