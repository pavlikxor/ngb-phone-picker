import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, required } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  getCountryCodeForRegionCode,
  getRegionCodeForCountryCode,
} from 'awesome-phonenumber';
import { countries } from 'country-flag-icons';
import { HighlightTextDirective } from './highlight-text/highlight.directive';
import { phoneValidator } from './phone-num.validator';
import { RegionNameService } from './region-names';

interface CountryOption {
  code: string;
  countryName: string;
  counntryCode: number;
}

@Component({
  selector: 'lib-phone-num-picker',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatMenuModule,
    HighlightTextDirective,
  ],
  templateUrl: './phone-num-picker.html',
  styleUrl: './phone-num-picker.scss',
})
export class PhoneNumPicker {
  private regionNameService = inject(RegionNameService);
  region = input<string | undefined>();
  private readonly countryCodes = signal<readonly string[]>(countries);
  readonly countryOptions = computed(() => {
    const region = this.region()?.toUpperCase();
    return this.countryCodes().map(code => {
      const countryCode = getCountryCodeForRegionCode(code);
      const regionCode = getRegionCodeForCountryCode(countryCode);
      return {
        countryCode,
        code,
        countryName:
          this.regionNameService.getRegionLocalName(regionCode, region) ||
          regionCode,
      };
    });
  });

  prefferedCountries = computed(() => this.countryOptions());
  filteredCountries = computed(() => this.countryOptions());

  protected readonly phoneNumber = signal({
    countryCode: '',
    phoneNumber: '',
  });

  protected readonly orderForm = form(
    this.phoneNumber,
    // schemaPath => {
    //   required(schemaPath.phoneNumber, {
    //     message: 'spare-parts.phone.error-required',
    //   });
    // },
  );


}
