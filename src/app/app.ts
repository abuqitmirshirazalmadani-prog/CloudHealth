import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { AuthService } from './auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule],
  template: `
    @if (!authService.isAuthReady()) {
      <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <mat-icon class="text-emerald-600 text-4xl w-10 h-10 animate-pulse mb-4">favorite</mat-icon>
        <div class="text-slate-500 font-medium">Loading CloudHealth...</div>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
})
export class App {
  authService = inject(AuthService);
}
