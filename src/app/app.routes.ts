import { Routes } from '@angular/router';
import { TimelineComponent } from './features/timeline/timeline.component';

export const routes: Routes = [
  {
    path: '',
    component: TimelineComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
