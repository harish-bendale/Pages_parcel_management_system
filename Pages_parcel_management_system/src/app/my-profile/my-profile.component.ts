import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  user: any = {};

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (e) {
          console.error('Error parsing user data from localStorage', e);
        }
      }
    }
  }
}
