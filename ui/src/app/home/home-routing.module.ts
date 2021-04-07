import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../utils/auth.guard';
import { DatasetComponent } from './dataset/dataset.component';
import { EnvironmentsComponent } from './environments/environments.component';
import { HomeComponent } from './home.component';
import { TestsComponent } from './tests/tests.component';
import { ResultsComponent } from './results/results.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'env' },
      { path: 'env', component: EnvironmentsComponent },
      { path: 'tests', component: TestsComponent },
      { path: 'dataset', component: DatasetComponent },
      { path: 'results', component: ResultsComponent }
    ],
    canActivateChild: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
