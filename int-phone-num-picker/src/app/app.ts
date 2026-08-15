import { Component, signal } from '@angular/core';
import { PhoneNumPicker } from '../../projects/phone-num-picker/src/public-api';

@Component({
  selector: 'app-root',
  imports: [PhoneNumPicker],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('int-phone-num-picker');
}
