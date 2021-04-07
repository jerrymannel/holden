import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { EnvironmentsComponent } from './environments/environments.component';
import { TestsComponent } from './tests/tests.component';
import { DatasetComponent } from './dataset/dataset.component';
import { ResultsComponent } from './results/results.component';


@NgModule({
  declarations: [HomeComponent, EnvironmentsComponent, TestsComponent, DatasetComponent, ResultsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
