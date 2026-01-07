import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  imports: [],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  companyEmail = 'shipin@gmail.com';
  supportPhone = '+91 98765 43210';
  workingDays = 'Mon – Sat';
  workingHours = '9:00 AM – 6:00 PM';
}
