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
    urls: [],
    tests: []
  };

  url: string;
  selectedUrlIndex: number;

  showEditCreateModal = false;
  showDeleteConfirmation = false;

  operations = ['POST', 'GET', 'PUT', 'DELETE'];

  tests: [];
  selectedTestID = null;
  selectedStepIndex = 0;
  requestTab = 1;
  responseTab = 1;

  result: any;

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
    this.url = null;
    this.selectedUrlIndex = null;
    this.createForm = {
      _id: null,
      name: null,
      urls: [],
      tests: []
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

  __convert(_toJSON: boolean, _data: any): any {
    let data = JSON.parse(JSON.stringify(_data))
    if (data.request.headers) data.request.headers = _toJSON ? JSON.parse(data.request.headers) : JSON.stringify(data.request.headers, null, ' ');
    if (data.request.data) data.request.data = _toJSON ? JSON.parse(data.request.data) : JSON.stringify(data.request.data, null, ' ');
    if (data.response.headers) data.response.headers = _toJSON ? JSON.parse(data.response.headers) : JSON.stringify(data.response.headers, null, ' ');
    if (data.response.data) data.response.data = _toJSON ? JSON.parse(data.response.data) : JSON.stringify(data.response.data, null, ' ');
    return data;
  }

  showForm(): void {
    this.selectedTestID = null;
    this.showEditCreateModal = true;
    this.__resetForm();
    this.__resetErrors();
    this.addStep();
  }

  selectTest(testID: string): void {
    this.showEditCreateModal = false;
    this.commonService.get('test', `/${testID}`, null)
      .subscribe(
        test => {
          this.createForm = JSON.parse(JSON.stringify(test));
          this.createForm.tests = this.createForm.tests.map(_tests => this.__convert(false, _tests));
          if (this.createForm.tests.length > 0 && testID != this.selectedTestID) {
            this.selectedTestID = testID;
          }
        },
        () => this.errors.fetch = 'Error fetching details of ' + testID
      );
  }

  saveUrl(): void {
    this.createForm.urls[this.selectedUrlIndex] = this.url;
    this.url = null;
    this.selectedUrlIndex = null;
  }

  selectStep(index: number): void {
    this.selectedStepIndex = index;
  }

  addStep(): void {
    let url = null;
    if (this.createForm.urls.length > 0) url = this.createForm.urls[0];
    this.createForm.tests.push({
      name: `Step-${this.createForm.tests.length + 1}`,
      url: url,
      request: {
        method: 'GET',
        uri: null,
        headers: null,
        data: null,
        responseCode: 200
      },
      response: {
        headers: null,
        data: null,
      }
    });
    this.selectStep(this.createForm.tests.length - 1);
  }

  removeStep(index: number): void {
    this.createForm.tests.splice(index, 1);
    if (this.createForm.tests.length > 0) {
      this.selectStep(0);
    } else {
      this.createForm.tests = [];
    }
  }

  reorder(direction, index: number): void {
    if (direction == -1 && index == 0) return;
    if (direction == 1 && index == (this.createForm.tests.length - 1)) return;
    let step = this.createForm.tests[index + direction]
    this.createForm.tests[index + direction] = this.createForm.tests[index]
    this.createForm.tests[index] = step
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
    let data = JSON.parse(JSON.stringify(this.createForm))
    data.tests = data.tests.map(_test => this.__convert(true, _test))
    if (this.selectedTestID) {
      this.commonService.put('test', `/${this.selectedTestID}`, data)
        .subscribe(
          () => this.selectTest(this.selectedTestID)
        );
    } else {
      this.commonService.post('test', '/', data)
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
    if (this.createForm.urls.length < 1) { this.errors.validation = 'At least one URL must be provided'; return true; }
    if (this.createForm.tests.length < 1) { this.errors.validation = 'At least one step must be present'; return true; }
    if (this.validateSteps()) { this.errors.validation = 'Error in step.'; return true; }
    return false;
  }

  validateSteps(): boolean {
    let flag = false;
    this.stepErrors = [];
    this.createForm.tests.forEach((_test, _index) => {
      if (!_test.name) { flag = true; this.stepErrors[_index] = "Missing name"; return; }
      if (!_test.request.uri) { flag = true; this.stepErrors[_index] = "Request URI missing"; return; }
      if (!_test.url) { flag = true; this.stepErrors[_index] = "Endpoint missing"; return; }
      if (this.createForm.urls.indexOf(_test.url) == -1) { flag = true; this.stepErrors[_index] = "Endpoint missing"; return; }
    })
    return flag;
  }

  runStep(stepId: number): void {
    if (!this.createForm._id) {
      alert("Please save the test before running")
      return
    }
    let payload = JSON.parse(JSON.stringify(this.createForm.tests[stepId]));
    payload = this.__convert(true, payload)
    this.commonService.post('test', `/run/${this.createForm._id}`, payload)
      .subscribe(
        data => {
          this.createForm.tests[stepId].response.headers = JSON.stringify(data.headers, null, '  ');
          this.createForm.tests[stepId].response.data = JSON.stringify(data.data, null, '  ');
          this.createForm.tests[stepId].request.responseCode = data.status;
        },
        err => console.log(err)
      )
  }

  runTest(): void {
    if (!this.createForm._id) {
      alert("Please save the test before running")
      return
    }
    this.commonService.post('test', `/runTest/${this.createForm._id}`, {})
      .subscribe(
        data => this.result = data,
        err => console.log(err)
      )
  }

}
