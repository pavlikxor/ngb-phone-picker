import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { parsePhoneNumber } from 'awesome-phonenumber';

export function phoneValidator(countryCode: string = 'US'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values; use Validators.required for that
    }

    const pn = parsePhoneNumber(control.value, { regionCode: countryCode });
    return pn.valid ? null : { invalidPhoneNumber: true };
  };
}