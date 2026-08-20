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
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  debounce,
  disabled,
  form,
  FormField,
  FormValueControl,
  pattern,
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
  selector: 'ngb-phone-picker',
  imports: [
    FormField,
    NgbHighlight,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownButtonItem,
  ],
  templateUrl: './ngb-phone-picker.html',
  styleUrl: './ngb-phone-picker.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NgbPhonePicker implements FormValueControl<PhoneNumberModel> {
  // --- FormValueControl API ---
  value = model<PhoneNumberModel>(null);
  disabled = input(false);
  required = input(false);

  // --- Inputs ---
  region = input<string | undefined>();
  prefferedCountries = input<string[] | undefined>();

  private regionNameService = inject(RegionNameService);

  private countryPrefixes = signal<string[]>(getSupportedRegionCodes());

  private countryOptions: Signal<CountryOption[]> = computed(() => {
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
    const query = (this.countrySearch().query ?? '').trim().toUpperCase();

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

  phoneNumber = signal({
    phoneNumber: '',
  });

  phoneForm = form(this.phoneNumber, schemaPath => {
    disabled(schemaPath, { when: () => this.disabled() });
    pattern(schemaPath.phoneNumber, /^[0-9\- ]+$/, {
      message: 'Only digits, spaces, and dashes allowed',
    });
    validate(schemaPath.phoneNumber, ({ value }) => {
      const inputValue = value();
      const prefix = this.selectedCountry()?.prefix;
      if (!inputValue || !prefix) {
        return null;
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

  countrySearch = signal({
    query: '',
  });

  searchCountryForm = form(this.countrySearch, schemaPath => {
    disabled(schemaPath, { when: () => this.disabled() });
    debounce(schemaPath.query, 100);
  });

  countrySearchInput =
    viewChild.required<ElementRef<HTMLInputElement>>('countrySearchInput');
  phoneInput = viewChild.required<ElementRef<HTMLInputElement>>('phoneInput');

  dropdownChange(isOpened: boolean): void {
    isOpened
      ? requestAnimationFrame(() => {
          const countrySearchInputInput =
            this.countrySearchInput()?.nativeElement;
          if (countrySearchInputInput) {
            countrySearchInputInput.focus();
          }
        })
      : this.phoneInput().nativeElement.focus();
  }

  countryOptionClick(country: CountryOption) {
    this.selectedCountry.update(() => country);
    this.countrySearch.update(() => ({ query: '' }));
  }

  reset(): void {
    this.selectedCountry.set(undefined);
    this.phoneNumber.set({ phoneNumber: '' });
    this.phoneForm().reset({ phoneNumber: '' });
    this.countrySearch.set({ query: '' });
    this.searchCountryForm().reset({ query: '' });
    this.value.set(null);
  }

  constructor() {
    // 1. INWARD SYNC: Parent Form (this.value) -> Internal UI Signals
    effect(() => {
      const parentVal = this.value();

      untracked(() => {
        if (!parentVal) {
          if (!this.selectedCountry()) {
            this.phoneNumber.set({ phoneNumber: '' });
          }
          return;
        }

        // Match country by countryCode
        const matchedCountry = this.countryOptions().find(
          c => c.countryCode === parentVal.countryCode,
        );

        if (
          matchedCountry &&
          this.selectedCountry()?.countryCode !== matchedCountry.countryCode
        ) {
          this.selectedCountry.set(matchedCountry);
        }

        const phoneStr = parentVal.phoneNumber
          ? parentVal.phoneNumber.toString()
          : '';
        if (this.phoneNumber().phoneNumber !== phoneStr) {
          this.phoneNumber.set({ phoneNumber: phoneStr });
        }
      });
    });

    // 2. OUTWARD SYNC: Internal UI Signals -> Parent Form (this.value)
    effect(() => {
      const selectedCountry = this.selectedCountry();
      const phoneNumber = this.phoneNumber().phoneNumber;
      const isPhoneFormValid = this.phoneForm().valid();

      untracked(() => {
        if (selectedCountry && isPhoneFormValid && phoneNumber) {
          const cleanPhoneStr = phoneNumber.replace(/\D/g, '');
          if (cleanPhoneStr) {
            const parsedNumber = parseInt(cleanPhoneStr, 10);
            const currentVal = this.value();

            // Avoid triggering redundant updates if values are identical
            if (
              !currentVal ||
              currentVal.countryCode !== selectedCountry.countryCode ||
              currentVal.phoneNumber !== parsedNumber
            ) {
              this.value.set({
                countryCode: selectedCountry.countryCode,
                phoneNumber: parsedNumber,
              });
            }
            return;
          }
        }

        if (this.value() !== null) {
          this.value.set(null);
        }
      });
    });
  }
}
