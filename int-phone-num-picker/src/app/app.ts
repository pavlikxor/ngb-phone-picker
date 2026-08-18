import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { PhoneNumPicker } from '../../projects/phone-num-picker/src/public-api';

@Component({
  selector: 'app-root',
  imports: [PhoneNumPicker, JsonPipe, FormField],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('int-phone-num-picker');

  phone = signal({
    number: null,
  });

  phoneForm = form(this.phone);
}
