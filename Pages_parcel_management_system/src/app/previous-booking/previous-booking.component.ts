import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Booking {
  customerId: string;
  bookingId: string;
  bookingDate: string; // YYYY-MM-DD
  receiverName: string;
  deliveredAddress: string;
  amount: number;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  hasFeedback?: boolean; // Track if feedback is already submitted
}

@Component({
  selector: 'app-previous-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './previous-booking.component.html',
  styleUrls: ['./previous-booking.component.css']
})
export class PreviousBookingComponent implements OnInit {
  // Mock Data
  allBookings: Booking[] = [];
  displayedBookings: Booking[] = [];

  // Filters
  filterBookingId: string = '';
  filterDate: string = '';
  filterStatus: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Feedback Modal
  isFeedbackModalOpen: boolean = false;
  selectedBooking: Booking | null = null;
  feedbackRating: number = 0;
  feedbackSuggestion: string = '';
  feedbackError: string = '';
  feedbackSuccess: string = '';

  ngOnInit(): void {
    this.loadMockData();
    this.applyFilters();
  }

  loadMockData() {
    // Simulating backend fetch of complete dataset
    // Generating 50 mock entries for demonstration
    const statuses: ('Pending' | 'In Transit' | 'Delivered' | 'Cancelled')[] = ['Pending', 'In Transit', 'Delivered', 'Cancelled'];
    for (let i = 1; i <= 50; i++) {
      // Randomly assign initial feedback status for demo purposes
      this.allBookings.push({
        customerId: `CUST-${1000 + i}`,
        bookingId: `BK-${2025000 + i}`,
        bookingDate: this.getRandomDate(new Date(2024, 0, 1), new Date()),
        receiverName: `Receiver ${i}`,
        deliveredAddress: `${i} Main St, City ${i}`,
        amount: Math.floor(Math.random() * 500) + 50,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        hasFeedback: false
      });
    }
  }

  getRandomDate(start: Date, end: Date): string {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }

  applyFilters() {
    let tempBookings = this.allBookings;

    if (this.filterBookingId) {
      tempBookings = tempBookings.filter(b => b.bookingId.toLowerCase().includes(this.filterBookingId.toLowerCase()));
    }

    if (this.filterDate) {
      tempBookings = tempBookings.filter(b => b.bookingDate === this.filterDate);
    }

    if (this.filterStatus) {
      tempBookings = tempBookings.filter(b => b.status === this.filterStatus);
    }

    this.totalPages = Math.ceil(tempBookings.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;

    // Reset to page 1 if current page is out of bounds after filter
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    // Pagination Logic
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedBookings = tempBookings.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onFilterChange() {
    this.currentPage = 1; // Reset to first page on filter change
    this.applyFilters();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  downloadExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.allBookings);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
    XLSX.writeFile(wb, 'bookings.xlsx');
  }

  downloadPDF() {
    const doc = new jsPDF();
    const head = [['Customer ID', 'Booking ID', 'Date', 'Receiver', 'Address', 'Amount', 'Status']];
    const data = this.allBookings.map(b => [
      b.customerId,
      b.bookingId,
      b.bookingDate,
      b.receiverName,
      b.deliveredAddress,
      b.amount,
      b.status
    ]);

    autoTable(doc, {
      head: head,
      body: data,
    });

    doc.save('bookings.pdf');
  }

  // Helper for UI to show if download is available
  get showDownloadOptions(): boolean {
    return this.allBookings.length > 10;
  }

  // --- Feedback Logic ---

  openFeedbackModal(booking: Booking) {
    this.selectedBooking = booking;
    this.feedbackRating = 0;
    this.feedbackSuggestion = '';
    this.feedbackError = '';
    this.feedbackSuccess = '';
    this.isFeedbackModalOpen = true;
  }

  closeFeedbackModal() {
    this.isFeedbackModalOpen = false;
    this.selectedBooking = null;
  }

  setRating(rating: number) {
    this.feedbackRating = rating;
  }

  submitFeedback() {
    // 1. Validation
    if (!this.selectedBooking) return;

    if (this.feedbackRating === 0) {
      this.feedbackError = 'Please select a star rating.';
      return;
    }

    // 2. Build Request Object
    const feedbackData = {
      bookingId: this.selectedBooking.bookingId,
      customerId: this.selectedBooking.customerId,
      rating: this.feedbackRating,
      feedbackSuggestion: this.feedbackSuggestion
    };

    console.log('Sending Feedback to Backend:', feedbackData);

    // 3. Prevent duplicate submission (Simulated check)
    if (this.selectedBooking.hasFeedback) {
      this.feedbackError = 'Feedback already submitted for this booking.';
      return;
    }

    // 4. Simulate API Call Success
    // In a real app, this would be an http post subscribe
    setTimeout(() => {
      // Success logic
      this.selectedBooking!.hasFeedback = true; // Update local state
      this.feedbackSuccess = 'Feedback submitted successfully!';

      // Close modal after short delay to show success message
      setTimeout(() => {
        this.closeFeedbackModal();
      }, 1500);
    }, 500);
  }
}
