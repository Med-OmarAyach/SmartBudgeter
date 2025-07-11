import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
interface NavItem {
  title: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
    imports: [
    MatSidenavModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,CommonModule
  ],
  
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { title: 'Home', route: '/home' },
    { title: 'About', route: '/about' },
    { title: 'Services', route: '/services' },
    { title: 'Contact', route: '/contact' }
  ];

  constructor(private router: Router) {}

  goToProSolution() {
    window.open('https://material-kit-pro-react.devias.io/', '_blank');
  }
}
