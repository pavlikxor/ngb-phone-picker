import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { disabled, form, FormField } from '@angular/forms/signals';
import {
  PhoneNumberModel,
  PhoneNumPicker,
} from '../../projects/phone-num-picker/src/public-api';

@Component({
  selector: 'app-root',
  imports: [PhoneNumPicker, JsonPipe, FormField],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('int-phone-num-picker');

  phone = signal<PhoneNumberModel>({
    //number: null,

    countryCode: 380,
    phoneNumber: 679438810,
  });

  phoneForm = form(this.phone, schemaPath => {
    disabled(schemaPath, { when: () => !true });
  });
}
