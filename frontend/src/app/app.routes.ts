import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { contactGuard } from './core/guards/contact.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent),
  },
  {
    path: 'contact',
    canActivate: [contactGuard],
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
  },

  // Admin routes
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./admin/projects/projects.component').then(m => m.AdminProjectsComponent),
      },


      {
        path: 'about',
        loadComponent: () => import('./admin/about/about.component').then(m => m.AdminAboutComponent),
      },
      {
        path: 'experience',
        loadComponent: () => import('./admin/experience/experience.component').then(m => m.AdminExperienceComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./admin/settings/settings.component').then(m => m.AdminSettingsComponent),
      },
      {
        path: 'technologies',
        loadComponent: () => import('./admin/technologies/technologies.component').then(m => m.AdminTechnologiesComponent),
      },
      {
        path: 'contact',
        loadComponent: () => import('./admin/contact/contact.component').then(m => m.AdminContactComponent),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
