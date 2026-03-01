import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import type { Role } from '../../../core/models/types';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: Role[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  role = computed(() => this.authService.currentUser()?.role ?? null);

  adminNav: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', roles: ['ADMIN'] },
    { label: 'Donations', path: '/admin/dons', icon: 'volunteer_activism', roles: ['ADMIN'] },
    { label: 'Demandes', path: '/admin/demandes', icon: 'emergency', roles: ['ADMIN'] },
    { label: 'Stocks', path: '/admin/stocks', icon: 'bloodtype', roles: ['ADMIN'] },
    { label: 'Donneurs', path: '/admin/donneurs', icon: 'people', roles: ['ADMIN'] },
    { label: 'Campagnes', path: '/admin/campagnes', icon: 'campaign', roles: ['ADMIN'] },
  ];

  superAdminNav: NavItem[] = [
    { label: 'Dashboard', path: '/superadmin/dashboard', icon: 'dashboard', roles: ['SUPER_ADMIN'] },
    { label: 'Hôpitaux', path: '/superadmin/hopitaux', icon: 'local_hospital', roles: ['SUPER_ADMIN'] },
    { label: 'Stats', path: '/superadmin/stats', icon: 'bar_chart', roles: ['SUPER_ADMIN'] },
    { label: 'Campagnes nationales', path: '/superadmin/campagnes', icon: 'campaign', roles: ['SUPER_ADMIN'] },
    { label: 'Notifications', path: '/superadmin/notifications', icon: 'notifications', roles: ['SUPER_ADMIN'] },
  ];

  userNav: NavItem[] = [
    { label: 'Mon profil', path: '/donneur/profil', icon: 'person', roles: ['USER'] },
    { label: 'Donner', path: '/donneur/dons', icon: 'volunteer_activism', roles: ['USER'] },
    { label: 'Mes dons', path: '/donneur/dons', icon: 'history', roles: ['USER'] },
    { label: 'Badges', path: '/donneur/badges', icon: 'military_tech', roles: ['USER'] },
    { label: 'Classement', path: '/donneur/classement', icon: 'emoji_events', roles: ['USER'] },
    { label: 'Campagnes', path: '/donneur/campagnes', icon: 'campaign', roles: ['USER'] },
    { label: 'Chatbot', path: '/chatbot', icon: 'smart_toy', roles: ['USER'] },
  ];

  navItems = computed(() => {
    const r = this.role();
    if (r === 'SUPER_ADMIN') return this.superAdminNav;
    if (r === 'ADMIN') return this.adminNav;
    if (r === 'USER') return this.userNav;
    return [];
  });

  constructor(public authService: AuthService) {}
}
