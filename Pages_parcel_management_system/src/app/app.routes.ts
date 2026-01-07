import { Routes } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SupportComponent } from './support/support.component';

import { PreviousBookingComponent } from './previous-booking/previous-booking.component';

export const routes: Routes = [
    { path: 'my-profile', component: MyProfileComponent },
    { path: 'support', component: SupportComponent },
    { path: 'previous-booking', component: PreviousBookingComponent }
];
