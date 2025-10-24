import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sign-in-buttons">
      <button type="button" class="sign-in-btn google-btn" (click)="googleClick.emit()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>{{ googleText }}</span>
      </button>

      <button type="button" class="sign-in-btn apple-btn" (click)="appleClick.emit()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.07-.5-2.05-.48-3.18 0-1.4.62-2.14.44-2.96-.4C1.65 13.64 2.93 6.13 9.13 5.85c1.52.05 2.58.83 3.46.88 1.32-.16 2.58-.91 3.98-.81 1.68.12 2.95.8 3.68 2.04-3.24 1.93-2.76 6.21.66 7.43-.43 1.13-.98 2.25-1.86 3.29M11.02 5.71c-.16-2.28 1.84-4.15 4.06-4.18.35 2.49-2.28 4.37-4.06 4.18z"/>
        </svg>
        <span>{{ appleText }}</span>
      </button>
    </div>
  `,
  styles: [`
    // Sign in buttons container - EXACT Figma specs
    .sign-in-buttons {
      display: flex;
      width: 345px;
      gap: 8px; // EXACT gap from Figma
      
      .sign-in-btn {
        // Each button: 168.5px width (stretched to fill with flex: 1 0 0)
        display: flex;
        height: 46px;
        padding: 12px 24px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex: 1 0 0; // Makes buttons stretch equally
        border-radius: 24px;
        background: #000;
        backdrop-filter: blur(12px);
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #FFFFFF;
        font-family: "SF UI Display", -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        font-weight: 600;
        
        &:hover {
          opacity: 0.9;
        }
        
        &:active {
          transform: scale(0.98);
        }
        
        svg {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
        
        span {
          white-space: nowrap;
          color: #FFFFFF;
        }
      }
    }
  `]
})
export class AuthButtonsComponent {
  @Input() googleText: string = 'Sign in';
  @Input() appleText: string = 'Sign in';
  @Output() googleClick = new EventEmitter<void>();
  @Output() appleClick = new EventEmitter<void>();
}
