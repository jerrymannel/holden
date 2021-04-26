import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonService } from '../../utils/common.service';
import { httpStatusCodes } from 'src/assets/statusCodes';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

  createForm = {
    _id: null,
    name: null,
    tests: []
  };
  createStep = {
    name: `Step-${this.createForm.tests.length + 1}`,
    request: {
      method: 'GET',
      uri: null,
      headers: null,
      body: null,
      responseCode: 200
    },
    response: {
      headers: null,
      body: null,
    }
  };
  url: string;
  urlIndex = null;

  showEditCreateModal = false;
  showDeleteConfirmation = false;

  operations = ['POST', 'GET', 'PUT', 'DELETE'];

  tests: [];
  selectedTestID = null;
  selectedStepIndex = 0;
  requestTab = 1;
  responseTab = 1;

  errors = {
    createUpdate: null,
    fetch: null,
    validation: null
  };
  stepErrors = {};

  httpStatusCodes = httpStatusCodes;

  constructor(
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.__getTests();
  }

  __resetForm(): void {
    this.createForm = {
      _id: null,
      name: null,
      tests: []
    };
    this.createStep = {
      name: `Step-${this.createForm.tests.length + 1}`,
      request: {
        method: 'GET',
        uri: null,
        headers: null,
        body: null,
        responseCode: 200
      },
      response: {
        headers: null,
        body: null,
      }
    };
  }

  __resetErrors(): void {
    this.errors = {
      createUpdate: null,
      fetch: null,
      validation: null
    };
    this.stepErrors = {};
  }

  __getTests(): void {
    const options = {
      sort: 'name',
      select: '_id,name'
    };
    this.commonService.get('test', `/`, options)
      .subscribe(
        tests => {
          this.tests = tests;
          if (tests.length > 0) {
            this.selectTest(tests[0]._id);
          }
        },
        () => this.errors.fetch = 'Error fetching tests'
      );
  }

  showForm(): void {
    this.selectedTestID = null;
    this.showEditCreateModal = true;
    this.urlIndex = null;
    this.__resetForm();
    this.__resetErrors();
    this.addStep();
  }

  selectTest(testID: string): void {
    this.selectedTestID = testID;
    this.showEditCreateModal = false;
    this.commonService.get('test', `/${testID}`, null)
      .subscribe(
        test => {
          this.createForm = JSON.parse(JSON.stringify(test));
          if (this.createForm.tests.length > 0) {
            this.selectStep(0);
          }
        },
        () => this.errors.fetch = 'Error fetching details of ' + testID
      );
  }

  selectStep(index: number): void {
    this.createStep = JSON.parse(JSON.stringify(this.createForm.tests[index]));
    this.selectedStepIndex = index;
  }

  addStep(): void {
    this.createForm.tests.push({
      name: `Step-${this.createForm.tests.length + 1}`,
      request: {
        method: 'GET',
        uri: null,
        headers: null,
        body: null,
        responseCode: 200
      },
      response: {
        headers: null,
        body: null,
      }
    });
    this.selectStep(this.createForm.tests.length - 1);
  }

  removeStep(index: number): void {
    this.createForm.tests.splice(index, 1);
    this.createStep = null;
    if (this.createForm.tests.length > 0) {
      this.selectStep(0);
    } else {
      this.createForm.tests = [];
    }
  }

  compareDelimiters(arg1, arg2: any): boolean {
    return arg1?.join(',') === arg2?.join(',');
  }

  endpointUpdated(event: any): void {
    this.createForm.tests[this.selectedStepIndex].endpoint = event.target.value;
  }

  createTest(): void {
    this.__resetErrors();
    this.commonService.post('test', '/', this.createForm)
      .subscribe(
        () => {
          this.__getTests();
        },
        () => this.errors.createUpdate = 'Error creating test ' + this.createForm._id
      );
  }

  updateTest(): void {
    this.__resetErrors();
    this.commonService.put('test', `/${this.createForm._id}`, this.createForm)
      .subscribe(
        () => {
          this.__getTests();
        },
        () => this.errors.createUpdate = 'Error updating test ' + this.createForm._id
      );
  }

  deleteTest(): void {
    this.__resetErrors();
    this.commonService.delete('test', `/${this.createForm._id}`)
      .subscribe(
        () => {
          this.showDeleteConfirmation = false;
          this.__getTests();
        },
        () => this.errors.createUpdate = 'Error deleting test ' + this.createForm._id
      );
  }

  stringify(data: any): string {
    return JSON.stringify(data, null, ' ');
  }

  getVerboseStatusCode(code: number): string {
    let statusCode = httpStatusCodes.find(statusCode => statusCode[0] === code);
    if (statusCode && statusCode.length > 0) {
      statusCode = statusCode[1];
    }
    return statusCode;
  }

  getStatusCodeClass(code: number): string {
    if (code < 300) return 'text-success';
    if (code < 400) return 'text-primary';
    if (code < 500) return 'text-warning';
    if (code < 600) return 'text-danger';
  }

  saveTest(): void {
    console.log(this.createForm);
    if (this.selectedTestID) {
      this.commonService.put('test', `/${this.selectedTestID}`, this.createForm)
        .subscribe(
          () => this.selectTest(this.selectedTestID)
        );
    } else {
      this.commonService.post('test', '/', this.createForm)
        .subscribe(
          data => {
            this.selectTest(data._id);
            this.__getTests();
          }
        );
    }
  }

  validateForm(): boolean {
    this.__resetErrors();
    if (!this.createForm.name) { this.errors.validation = 'Name missing'; return true; }
    if (this.validateSteps()) { this.errors.validation = 'Error in step.'; return true; }
    return false;
  }

  // {
  //   delimiters: ['<%', '%>'],
  //   endpoint: null,
  //   name: `Step-${this.createForm.tests.length + 1}`,
  //   request: {
  //     method: 'GET',
  //     uri: null,
  //     headers: null,
  //     body: null,
  //     responseCode: 200
  //   },
  //   response: {
  //     headers: null,
  //     body: null,
  //   }
  // };

  validateSteps(): boolean {
    let flag = false;
    this.stepErrors = [];
    this.createForm.tests.forEach((_test, _index) => {
      if (!_test.name) { flag = true; this.stepErrors[_index] = "Missing name"; return; }
      if (!_test.endpoint) { flag = true; this.stepErrors[_index] = "Endpoint missing"; return; }
      if (!_test.request.uri) { flag = true; this.stepErrors[_index] = "Request URI missing"; return; }
    })
    return flag;
  }

}
