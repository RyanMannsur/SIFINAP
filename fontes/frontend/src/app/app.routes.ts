import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/component';
import { AdicionarDividaComponent } from './pages/adicionar-divida/component';
import { CartoesComponent } from './pages/cartoes/component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'mes/:ano/:mes',
    component: DashboardComponent
  },
  {
    path: 'adicionar-divida',
    component: AdicionarDividaComponent
  },
  {
    path: 'cartoes',
    component: CartoesComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

