import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  template: `
    <div class="app-container">
      <div class="mobile-overlay" [ngClass]="{'active': isSidebarOpen}" (click)="closeMobileSidebar()"></div>
      <app-sidebar (toggleSidebar)="onToggleSidebar($event)"></app-sidebar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #121621 0%, #121621 100%);
        min-height: 100vh;
        color: #333;
      }

      .app-container {
        display: flex;
        min-height: 100vh;
      }

      .main-content {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
      }

      .mobile-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
      }

      @media (max-width: 768px) {
        .mobile-overlay.active {
          display: block;
        }

        .main-content {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class AppComponent {
  isSidebarOpen = false;

  onToggleSidebar(event: any) {
    this.isSidebarOpen = typeof event === 'boolean' ? event : !!event?.isOpen;
  }

  closeMobileSidebar() {
    this.isSidebarOpen = false;
  }
}