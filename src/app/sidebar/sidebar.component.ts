import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar" [ngClass]="{'collapsed': isCollapsed, 'open': isMobileOpen}">
      <div class="sidebar-header">
        <div class="logo">ET</div>
        <div class="logo-text">Expense Tracker</div>
      </div>
      <nav class="nav-menu">
        <div class="nav-item" routerLink="/historique" routerLinkActive="active">
          <i data-lucide="history"></i>
          <span>Historique des Dépenses</span>
        </div>
        <div class="nav-item" routerLink="/budget" routerLinkActive="active">
          <i data-lucide="pie-chart"></i>
          <span>Budget & Alertes</span>
        </div>
        <div class="nav-item" routerLink="/rappels-et-conseils" routerLinkActive="active">
          <i data-lucide="tag"></i>
          <span>rappels et conseils</span>
        </div>
        <div class="nav-item" routerLink="/settings" routerLinkActive="active">
          <i data-lucide="settings"></i>
          <span>Paramètres</span>
        </div>
      </nav>
      <button class="toggle-btn" (click)="toggleSidebarfn()">
        <i [attr.data-lucide]="isCollapsed ? 'chevron-right' : 'chevron-left'" id="toggleIcon"></i>
      </button>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        width: 280px;
        background: #121621;
        backdrop-filter: blur(10px);
        border-right: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }

      .sidebar.collapsed {
        width: 80px;
      }

      .sidebar-header {
        padding: 2rem 1.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .logo {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #121621, #121621);
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.2rem;
      }

      .logo-text {
        font-size: 1.4rem;
        font-weight: 700;
        background: linear-gradient(135deg, #121621, #121621);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        transition: opacity 0.3s ease;
      }

      .sidebar.collapsed .logo-text {
        opacity: 0;
        width: 0;
      }

      .nav-menu {
        padding: 1rem 0;
      }

      .nav-item {
        margin: 0.5rem 1rem;
        padding: 1rem 1.5rem;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #64748b;
        font-weight: 500;
      }

      .nav-item:hover {
        background: rgba(102, 126, 234, 0.1);
        color: #635BFF;
        transform: translateX(5px);
      }

      .nav-item.active {
        background: linear-gradient(135deg, #635BFF, #635BFF);
        color: white;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      .nav-item i {
        width: 20px;
        height: 20px;
      }

      .sidebar.collapsed .nav-item span {
        opacity: 0;
        width: 0;
      }

      .toggle-btn {
        position: absolute;
        top: 50%;
        right: -15px;
        width: 30px;
        height: 30px;
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .toggle-btn:hover {
        background: #635BFF;
        border-color: #635BFF;
        color: white;
      }

      @media (max-width: 768px) {
        .sidebar {
          width: 280px;
          position: fixed;
          top: 0;
          left: -280px;
          height: 100vh;
          z-index: 1000;
        }

        .sidebar.open {
          left: 0;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  @Output() toggleSidebar = new EventEmitter<boolean>();
  isCollapsed = false;
  isMobileOpen = false;

  ngAfterViewInit() {
    // Initialize Lucide icons after view is initialized
    (window as any).lucide.createIcons();
  }

  toggleSidebarfn() {
    this.isCollapsed = !this.isCollapsed;
    this.isMobileOpen = !this.isMobileOpen;
    this.toggleSidebar.emit(this.isMobileOpen);
    setTimeout(() => {
      (window as any).lucide.createIcons();
    }, 0);
  }
}