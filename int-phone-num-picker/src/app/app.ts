import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { disabled, form, FormField } from '@angular/forms/signals';
import {
  PhoneNumberModel,
  NgbPhonePicker,
} from '../../projects/ngb-phone-picker/src/public-api';

@Component({
  selector: 'app-root',
  imports: [NgbPhonePicker, JsonPipe, FormField],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ngb-phone-picker');

  phone = signal<PhoneNumberModel>({
    countryCode: 45,
    phoneNumber: '26668888',
  });

  phoneForm = form(this.phone, schemaPath => {
    disabled(schemaPath, { when: () => !true });
  });
}
