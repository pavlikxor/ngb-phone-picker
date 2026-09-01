import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  NgbPhonePicker,
  PhoneNumberModel,
} from '../../projects/ngb-phone-picker/src/public-api';

@Component({
  selector: 'app-root',
  imports: [NgbPhonePicker, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly title = 'Phone number picker demo';

  readonly preferredCountries = ['ua', 'dk', 'us', 'de'];

  readonly phone = signal<PhoneNumberModel | null>({
    countryCode: 45,
    phoneNumber: '26668888',
  });

  setDemo(example: PhoneNumberModel): void {
    this.phone.set(example);
  }

  resetDemo(): void {
    this.phone.set({
      countryCode: 45,
      phoneNumber: '26668888',
    });
  }
}
