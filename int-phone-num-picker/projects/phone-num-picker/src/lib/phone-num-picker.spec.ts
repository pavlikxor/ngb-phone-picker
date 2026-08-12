import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumPicker } from './phone-num-picker';

describe('PhoneNumPicker', () => {
  let component: PhoneNumPicker;
  let fixture: ComponentFixture<PhoneNumPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneNumPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneNumPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
