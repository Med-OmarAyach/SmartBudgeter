import { Component, OnInit } from '@angular/core';
import { ReminderService, Reminder } from '../services/reminders.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {

  reminders: Reminder[] = [];
  
  newReminder: Reminder = {
    reminderId: 0,
    title: '',
    message: '',
    dueDate: '',
    completed: false
  };

  constructor(private reminderService: ReminderService) {}

  ngOnInit(): void {
    this.loadReminders();
  }

  // Load reminders from API
  loadReminders(): void {
    this.reminderService.getUserReminders().subscribe({
      next: (data) => {
        console.log('Reminders from API:', data);
        if (Array.isArray(data)) {
          this.reminders = data;
        } else {
          console.warn('Unexpected API response format', data);
          this.reminders = [];
        }
      },
      error: (err) => {
        console.error('Error loading reminders:', err);
        this.reminders = [];
      }
    });
  }

  // Add a new reminder
  addReminder(): void {
    if (!this.newReminder.title.trim()) return;

    this.reminderService.createReminder(this.newReminder).subscribe({
      next: (saved) => {
        console.log('Reminder created:', saved);
        this.reminders.push(saved);
        this.newReminder = { reminderId: 0, title: '', message: '', dueDate: '', completed: false };
      },
      error: (err) => {
        console.error('Error creating reminder:', err);
      }
    });
  }

  // Delete a reminder
  deleteReminder(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this reminder?')) return;

    this.reminderService.deleteReminder(id).subscribe({
      next: () => {
        console.log('Reminder deleted:', id);
        this.reminders = this.reminders.filter(r => r.reminderId !== id);
      },
      error: (err) => {
        console.error('Error deleting reminder:', err);
      }
    });
  }
}
