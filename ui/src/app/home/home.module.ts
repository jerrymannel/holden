import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TestsComponent } from './tests/tests.component';
import { ResultsComponent } from './results/results.component';
import { UsersComponent } from './users/users.component';
import { TestbucketComponent } from './testbucket/testbucket.component';
import { FunctionsComponent } from './functions/functions.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { EnvironmentComponent } from './environment/environment.component';


@NgModule({
  declarations: [HomeComponent, TestsComponent, ResultsComponent, UsersComponent, TestbucketComponent, FunctionsComponent, ScheduleComponent, EnvironmentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
