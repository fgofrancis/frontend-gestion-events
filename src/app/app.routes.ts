import { Routes } from '@angular/router';
import { authGuard } from './pages/auth/auth.guard';

export const routes: Routes = [


  // { path: 'eventos', loadComponent: () => import('./pages/eventos/eventos.component').then(m => m.EventosComponent) },
  // { path: 'categorias', loadComponent: () => import('./pages/categorias/categorias.component').then(m => m.CategoriasComponent) },
  // { path: 'ponentes', loadComponent: () => import('./pages/ponentes/ponentes.component').then(m => m.PonentesComponent) },
  // { path: 'auth', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent) },

  {
    path:'auth',
    children: [
      { path: 'login', loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent) },
      { path: 'registro', loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent) }
    ]
  },
  {
    path: 'eventos',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/eventos/eventos-list.component').then(m => m.EventosListComponent) },
      { path: 'nuevo', loadComponent: () => import('./pages/eventos/evento-form.component').then(m => m.EventoFormComponent) },
      { path: 'reporte', loadComponent: () => import('./pages/eventos/eventos-reporte.component').then(m => m.EventosReporteComponent) },
      { path: ':id/editar', loadComponent: () => import('./pages/eventos/evento-form.component').then(m => m.EventoFormComponent) }
    ]
  },
  {
    path: 'categorias',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/categorias/categorias-list.component').then(m => m.CategoriasListComponent) },
      { path: 'nueva', loadComponent: () => import('./pages/categorias/categoria-form.component').then(m => m.CategoriaFormComponent) },
      { path: ':id/editar', loadComponent: () => import('./pages/categorias/categoria-form.component').then(m => m.CategoriaFormComponent) },
    ],
  },
  {
    path: 'ponentes',
    canActivate: [authGuard],
    children: [
       { path: '', loadComponent: () => import('./pages/ponentes/ponentes-list.component').then(m => m.PonentesListComponent) },
       { path: 'nuevo', loadComponent: () => import('./pages/ponentes/ponente-form.component').then(m => m.PonenteFormComponent) },
       { path: ':id/editar', loadComponent: () => import('./pages/ponentes/ponente-form.component').then(m => m.PonenteFormComponent) }
    ]
  }
];
