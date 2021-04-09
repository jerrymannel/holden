import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../utils/auth.guard';
import { HomeComponent } from './home.component';
import { TestsComponent } from './tests/tests.component';
import { ResultsComponent } from './results/results.component';
import { TestbucketComponent } from './testbucket/testbucket.component';
import { UsersComponent } from './users/users.component';
import { FunctionsComponent } from './functions/functions.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'tests' },
      { path: 'tests', component: TestsComponent },
      { path: 'functions', component: FunctionsComponent },
      { path: 'testbucket', component: TestbucketComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'user', component: UsersComponent }
    ],
    canActivateChild: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
