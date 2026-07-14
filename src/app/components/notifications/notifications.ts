import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
  notifications = signal<Notification[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading.set(true);
    this.notificationService.getMyNotifications().subscribe({
      next: (notifs) => {
        this.notifications.set(notifs);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement notifications', err);
        this.errorMessage.set('Impossible de charger vos notifications');
        this.isLoading.set(false);
      }
    });
  }

  markAsRead(notification: Notification): void {
    if (notification.isRead) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      next: (updated) => {
        this.notifications.update(notifs =>
          notifs.map(n => n.id === updated.id ? updated : n)
        );
      },
      error: (err) => console.error('Erreur marquage lu', err)
    });
  }

  delete(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationService.delete(id).subscribe({
      next: () => {
        this.notifications.update(notifs => notifs.filter(n => n.id !== id));
      },
      error: (err) => console.error('Erreur suppression', err)
    });
  }
}