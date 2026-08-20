import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  Signal,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  debounce,
  form,
  FormField,
  FormValueControl,
  validate,
} from '@angular/forms/signals';

import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbHighlight,
} from '@ng-bootstrap/ng-bootstrap';
import {
  getCountryCodeForRegionCode,
  getSupportedRegionCodes,
  parsePhoneNumber,
} from 'awesome-phonenumber';
import { RegionNameService } from './region-names';

interface CountryOption {
  countryCode: number;
  prefix: string;
  countryName: string;
}

export type PhoneNumberModel = {
  countryCode: number;
  phoneNumber: number;
} | null;

@Component({
  selector: 'lib-phone-num-picker',
  imports: [
    FormField,
    NgbHighlight,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownButtonItem,
  ],
  templateUrl: './phone-num-picker.html',
  styleUrl: './phone-num-picker.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PhoneNumPicker implements FormValueControl<PhoneNumberModel> {
  value = model<PhoneNumberModel>(null);
  // errors?: InputSignal<readonly ValidationError.WithOptionalFieldTree[]> | InputSignalWithTransform<readonly ValidationError.WithOptionalFieldTree[], unknown> | undefined;
  readonly disabled = input(false);
  readonly required = input(false);
  // disabledReasons?: InputSignal<readonly WithOptionalFieldTree<DisabledReason>[]> | InputSignalWithTransform<readonly WithOptionalFieldTree<DisabledReason>[], unknown> | undefined;
  // readonly?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown> | undefined;
  // hidden?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown> | undefined;
  // invalid?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown> | undefined;
  // pending?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown> | undefined;
  // touched?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown> | undefined;
  // dirty?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown> | undefined;
  // name?: InputSignal<string> | InputSignalWithTransform<string, unknown> | undefined;
  // min?: InputSignal<{ countryCode: number; phoneNumber: number; } | undefined> | InputSignalWithTransform<{ countryCode: number; phoneNumber: number; } | undefined, unknown> | undefined;
  // minLength?: InputSignal<number | undefined> | InputSignalWithTransform<number | undefined, unknown> | undefined;
  // max?: InputSignal<{ countryCode: number; phoneNumber: number; } | undefined> | InputSignalWithTransform<{ countryCode: number; phoneNumber: number; } | undefined, unknown> | undefined;
  // maxLength?: InputSignal<number | undefined> | InputSignalWithTransform<number | undefined, unknown> | undefined;
  // pattern?: InputSignal<readonly RegExp[]> | InputSignalWithTransform<readonly RegExp[], unknown> | undefined;
  // touch?: OutputRef<void> | undefined;
  // focus?(options?: FocusOptions): void {
  //   throw new Error('Method not implemented.');
  // }
  reset(): void {
    this.selectedCountry.update(() => undefined);
    this.phoneNumber.update(() => ({ phoneNumber: '' }));
    this.phoneForm().reset(undefined);
    this.searchCountryForm().reset(undefined);
    this.searchModel.update(() => ({ query: '' }));
  }
  private regionNameService = inject(RegionNameService);
  region = input<string | undefined>();
  prefferedCountries = input<string[] | undefined>();
  private readonly countryPrefixes = signal<readonly string[]>(
    getSupportedRegionCodes(),
  );
  private readonly countryOptions: Signal<CountryOption[]> = computed(() => {
    const region = this.region()?.toUpperCase();
    return this.countryPrefixes().map(prefix => {
      const countryCode = getCountryCodeForRegionCode(prefix);
      return {
        countryCode,
        prefix,
        countryName:
          this.regionNameService.getRegionLocalName(prefix, region) || prefix,
      };
    });
  });

  filteredCountries = computed(() => {
    const options = this.countryOptions();
    const preferred = (this.prefferedCountries() || []).map(c =>
      c.toUpperCase(),
    );
    const query = (this.searchModel().query ?? '').trim().toUpperCase();

    const matchesQuery = (o: CountryOption) =>
      !query ||
      o.countryName.toUpperCase().includes(query) ||
      o.prefix.toUpperCase().includes(query) ||
      o.countryCode.toString().includes(query);

    const preferredOptions = options.filter(
      o => preferred.includes(o.prefix.toUpperCase()) && matchesQuery(o),
    );

    const otherOptions = options
      .filter(
        o => !preferred.includes(o.prefix.toUpperCase()) && matchesQuery(o),
      )
      .sort((a, b) => a.countryName.localeCompare(b.countryName));

    return [...preferredOptions, ...otherOptions];
  });

  selectedCountry = signal<CountryOption | undefined>(undefined);

  protected readonly phoneNumber = signal({
    phoneNumber: '',
  });

  protected readonly phoneForm = form(this.phoneNumber, schemaPath => {
    validate(schemaPath.phoneNumber, ({ value }) => {
      const inputValue = value();
      const prefix = this.selectedCountry()?.prefix;
      if (!inputValue || !prefix) {
        return null;
      }

      const allowedPattern = /^[0-9\- ]+$/;
      if (!allowedPattern.test(inputValue)) {
        return {
          kind: 'pattern',
          message: 'Only digits, spaces, and dashes allowed',
        };
      }

      const pn = parsePhoneNumber(inputValue, { regionCode: prefix });
      return pn.valid
        ? null
        : {
            kind: 'invalidPhoneNumber',
            message: `Invalid phone number for ${this.selectedCountry()?.countryName}`,
          };
    });
  });

  searchModel = signal({
    query: '',
  });

  protected readonly searchCountryForm = form(this.searchModel, schemaPath => {
    debounce(schemaPath.query, 100);
  });

  countrySearch =
    viewChild.required<ElementRef<HTMLInputElement>>('countrySearch');

  phoneInput = viewChild.required<ElementRef<HTMLInputElement>>('phoneInput');

  dropdownChange(isOpened: boolean): void {
    isOpened
      ? requestAnimationFrame(() => {
          const countrySearchInput = this.countrySearch()?.nativeElement;
          if (countrySearchInput) {
            countrySearchInput.focus();
          }
        })
      : this.phoneInput().nativeElement.focus();
  }

  countryOptionClick(country: CountryOption) {
    this.selectedCountry.update(() => country);
    this.searchModel.update(() => ({ query: '' }));
  }

  constructor() {
    effect(() => {
      const selectedCountry = this.selectedCountry();
      const phoneNumber = this.phoneNumber().phoneNumber;
      const isPhoneFormValid = this.phoneForm().valid();
      const value =
        selectedCountry && isPhoneFormValid && phoneNumber
          ? {
              countryCode: selectedCountry.countryCode,
              phoneNumber: parseInt(phoneNumber.replace(/\D/g, ''), 10)
            }
          : null;
      this.value.set(value);
    });
  }
}
