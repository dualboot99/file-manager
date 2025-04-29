import { Routes } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/upload',
  },
  {
    path: 'upload',
    component: UploadComponent,
  },
  {
    path: 'download',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/download/download.component').then(
        (c) => c.DownloadComponent
      ),
  },
  {
    path: 'tos',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/tos/tos.component').then((c) => c.TosComponent),
  },
  {
    path: '**',
    redirectTo: '/upload',
  },
];
