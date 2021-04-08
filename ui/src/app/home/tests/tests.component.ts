import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

  formTestSuite: FormGroup;

  showCreateModal = false;
  deleteConfirmation = false;
  selectedTab = 'Config';

  operations = ['ALL', 'POST', 'GET', 'PUT', 'DELETE', 'APPROVE'];
  updatedOperations = ['All', 'POST', 'GET', 'PUT', 'DELETE', 'APPROVE'];

  environments: any;
  selectedEnvironment: any;
  dataservices: any;
  selectedDataservice: any;
  datasets: any;
  testsuites = [];
  selectedTestsuite: any;
  attributes = [];
  tests = [];
  testProperties = {
    count: 0,
    page: 1,
    limit: 20
  };

  attribute: any;
  dataset: string;
  mapping = [];
  users = [];
  user = {
    username: '',
    password: '',
    operation: ''
  };

  errors = {
    misc: null,
    remove: null
  };

  spinners = {
    misc: false,
    remove: false
  };

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) {
    this.formTestSuite = this.fb.group({
      _id: ['', Validators.required],
      environment: ['', Validators.required],
      app: ['', Validators.required],
      dataservice: ['', Validators.required],
      dataserviceName: [''],
      api: ['', Validators.required],
      testEachAttribute: ['', Validators.required],
      testParams: [],
      users: [],
    });
  }

  ngOnInit(): void {
  }

  __resetErrors(): void {
    this.errors = {
      misc: null,
      remove: null
    };
  }

  __resetSpinners(): void {
    this.spinners = {
      misc: false,
      remove: false
    };
  }

}
