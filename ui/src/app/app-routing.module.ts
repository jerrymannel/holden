import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './utils/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canLoad: [AuthGuard] },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
