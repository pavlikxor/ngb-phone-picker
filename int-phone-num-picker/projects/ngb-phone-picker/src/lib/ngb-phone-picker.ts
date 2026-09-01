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

interface CountryOptionWithHighlighting extends CountryOption {
  prefixSegments: HighlightedSegment[];
  nameSegments: HighlightedSegment[];
}

interface HighlightedSegment {
  text: string;
  isMatch: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildHighlightedSegments(
  value: string,
  query: string,
): HighlightedSegment[] {
  const safeValue = value ?? '';
  const trimmedQuery = (query ?? '').trim();

  if (!trimmedQuery) {
    return [{ text: safeValue, isMatch: false }];
  }

  const regex = new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'ig');
  const parts = safeValue
    .split(regex)
    .filter(part => part.length > 0 || safeValue === '');

  return parts.map(part => ({
    text: part,
    isMatch: part.toLowerCase() === trimmedQuery.toLowerCase(),
  }));
}

export interface PhoneNumberModel {
  countryCode: number;
  phoneNumber: string;
}

export type PhoneNumberValue = PhoneNumberModel | null;

@Component({
  selector: 'ngb-phone-picker',
  imports: [
    FormField,
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
export class NgbPhonePicker implements FormValueControl<PhoneNumberValue> {
  value = model<PhoneNumberValue>(null);
  disabled = input(false);
  required = input(false);

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

  private countryQuery = computed(() => {
    const debouncedQuery = this.searchCountryForm.query().value() ?? '';
    const rawQuery = this.countrySearch().query ?? '';
    return (debouncedQuery || rawQuery).trim();
  });

  filteredCountries = computed<CountryOptionWithHighlighting[]>(() => {
    const options = this.countryOptions();
    const preferred = (this.prefferedCountries() || []).map(c =>
      c.toUpperCase(),
    );
    const query = this.countryQuery();
    const normalizedQuery = query.toUpperCase();

    const matchesQuery = (o: CountryOption) =>
      !normalizedQuery ||
      o.countryName.toUpperCase().includes(normalizedQuery) ||
      o.prefix.toUpperCase().includes(normalizedQuery) ||
      o.countryCode.toString().includes(normalizedQuery);

    const preferredOptions = options.filter(
      o => preferred.includes(o.prefix.toUpperCase()) && matchesQuery(o),
    );

    const otherOptions = options
      .filter(
        o => !preferred.includes(o.prefix.toUpperCase()) && matchesQuery(o),
      )
      .sort((a, b) => a.countryName.localeCompare(b.countryName));

    return [...preferredOptions, ...otherOptions].map(country => ({
      ...country,
      prefixSegments: buildHighlightedSegments(
        '+' + country.countryCode,
        query,
      ),
      nameSegments: buildHighlightedSegments(country.countryName, query),
    }));
  });

  selectedCountry = signal<CountryOption | undefined>(undefined);

  private phoneNumber = signal({
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

  private countrySearch = signal({
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

  private syncSelectionFromValue(parentVal: PhoneNumberValue): void {
    if (!parentVal) {
      if (!this.selectedCountry()) {
        this.phoneNumber.set({ phoneNumber: '' });
      }
      return;
    }
    const parsedNumber = parsePhoneNumber(`+${parentVal.countryCode}${parentVal.phoneNumber}`);
    console.log(parsedNumber);
    const matchedCountry = this.countryOptions().find(
      c => c.countryCode === parentVal.countryCode,
    );

    if (
      matchedCountry &&
      this.selectedCountry()?.countryCode !== matchedCountry.countryCode
    ) {
      this.selectedCountry.set(matchedCountry);
    }

    const phoneStr = parentVal.phoneNumber ?? '';
    if (this.phoneNumber().phoneNumber !== phoneStr) {
      this.phoneNumber.set({ phoneNumber: phoneStr });
    }
  }

  private syncValueFromSelection(): void {
    const selectedCountry = this.selectedCountry();
    const phoneNumber = this.phoneNumber().phoneNumber;
    const isPhoneFormValid = this.phoneForm().valid();

    if (!selectedCountry || !isPhoneFormValid || !phoneNumber) {
      if (this.value() !== null) {
        this.value.set(null);
      }
      return;
    }

    const cleanPhoneStr = phoneNumber.replace(/\D/g, '');
    if (!cleanPhoneStr) {
      if (this.value() !== null) {
        this.value.set(null);
      }
      return;
    }

    const nextValue = {
      countryCode: selectedCountry.countryCode,
      phoneNumber: cleanPhoneStr,
    };
    const currentVal = this.value();

    if (
      !currentVal ||
      currentVal.countryCode !== nextValue.countryCode ||
      currentVal.phoneNumber !== nextValue.phoneNumber
    ) {
      this.value.set(nextValue);
    }
  }

  constructor() {
    effect(() => {
      const parentVal = this.value();
      console.log(parentVal);
      untracked(() => this.syncSelectionFromValue(parentVal));
    });

    effect(() => {
      untracked(() => this.syncValueFromSelection());
    });
  }
}
