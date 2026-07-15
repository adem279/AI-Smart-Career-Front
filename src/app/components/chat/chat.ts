import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/message';
import { InterviewService } from '../../services/interview';
import { AuthService } from '../../services/auth';
import { Message } from '../../models/message.model';
import { Interview, InterviewRequest } from '../../models/interview.model';
import { isInterviewPast } from '../../utils/interview.util';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {
  messages = signal<Message[]>([]);
  interview = signal<Interview | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  newMessageContent = '';
  isSending = signal(false);

  showScheduleForm = signal(false);
  interviewDate = '';
  interviewTime = '';
  interviewLocation = '';
  interviewType = 'Présentiel';
  interviewMeetingLink = '';

  isInterviewPast = isInterviewPast;

  private applicationId!: number;
  private pollHandle: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private interviewService: InterviewService,
    private authService: AuthService
  ) {}

  get isCompany(): boolean {
    return this.authService.getUserType() === 'COMPANY';
  }

  get currentUserId(): number | null {
    return this.authService.getUserId();
  }

  ngOnInit(): void {
    this.applicationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMessages();
    this.loadInterview();
    this.markRead();

    this.pollHandle = setInterval(() => {
      this.loadMessages(true);
    }, 8000);
  }

  ngOnDestroy(): void {
    if (this.pollHandle) clearInterval(this.pollHandle);
  }

  loadMessages(silent = false): void {
    if (!silent) this.isLoading.set(true);
    this.messageService.getConversation(this.applicationId).subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        if (!silent) this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement messages', err);
        if (!silent) {
          this.errorMessage.set('Impossible de charger la conversation');
          this.isLoading.set(false);
        }
      }
    });
  }

  loadInterview(): void {
    this.interviewService.getByApplicationId(this.applicationId).subscribe({
      next: (interview) => this.interview.set(interview),
      error: () => this.interview.set(null)
    });
  }

  markRead(): void {
    this.messageService.markAsRead(this.applicationId).subscribe({
      error: (err) => console.error('Erreur marquage lu', err)
    });
  }

  isMine(message: Message): boolean {
    return message.senderId === this.currentUserId;
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim()) return;

    this.isSending.set(true);
    this.messageService.send({
      applicationId: this.applicationId,
      content: this.newMessageContent
    }).subscribe({
      next: (message) => {
        this.messages.update(list => [...list, message]);
        this.newMessageContent = '';
        this.isSending.set(false);
      },
      error: (err) => {
        console.error('Erreur envoi message', err);
        this.isSending.set(false);
      }
    });
  }

  openScheduleForm(): void {
    this.showScheduleForm.set(true);
    this.interviewDate = '';
    this.interviewTime = '';
    this.interviewLocation = '';
    this.interviewType = 'Présentiel';
    this.interviewMeetingLink = '';
  }

  cancelScheduleForm(): void {
    this.showScheduleForm.set(false);
  }

  confirmSchedule(): void {
    const request: InterviewRequest = {
      date: this.interviewDate,
      time: this.interviewTime,
      location: this.interviewLocation,
      type: this.interviewType,
      meetingLink: this.interviewMeetingLink || undefined
    };

    this.interviewService.schedule(this.applicationId, request).subscribe({
      next: (interview) => {
        this.interview.set(interview);
        this.showScheduleForm.set(false);
      },
      error: (err) => console.error('Erreur planification entretien', err)
    });
  }

  setResult(result: string): void {
    const interview = this.interview();
    if (!interview) return;

    this.interviewService.setResult(interview.id, result).subscribe({
      next: (updated) => this.interview.set(updated),
      error: (err) => console.error('Erreur mise à jour résultat', err)
    });
  }

  cancelInterview(): void {
    const interview = this.interview();
    if (!interview) return;

    this.interviewService.cancel(interview.id).subscribe({
      next: () => this.interview.set(null),
      error: (err) => console.error('Erreur annulation entretien', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/messages']);
  }
}