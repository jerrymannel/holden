import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

  createForm = {
    _id: null,
    name: null,
    url: [],
    tests: []
  };
  createStep = {
    delimiters: ['<%', '%>'],
    endpoint: null,
    name: null,
    request: {
      method: null,
      uri: null,
      headers: null,
      body: null,
      responseCode: null
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
  delimiters = [
    ['<%', '%>'],
    ['{{', '}}'],
    ['<<', '>>'],
  ];

  tests: [];
  selectedTestID = null;
  selectedStepIndex = 0;

  errors = {
    createUpdate: null,
    fetch: null
  };

  constructor(
    private commonService: CommonService,
  ) {
  }

  ngOnInit(): void {
    this.__getTests();
  }

  __resetForm(): void {
    this.createForm = {
      _id: null,
      name: null,
      url: [],
      tests: []
    };
    this.createStep = {
      delimiters: ['<%', '%>'],
      endpoint: null,
      name: null,
      request: {
        method: null,
        uri: null,
        headers: null,
        body: null,
        responseCode: null
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
      fetch: null
    };
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

  addUrl(): void {
    console.log(this.url, this.urlIndex);
    if (this.urlIndex != null) {
      this.removeURL(this.urlIndex);
      this.createForm.url.push(this.url);
    } else if (this.url && this.createForm.url.indexOf(this.url) === -1) {
      this.createForm.url.push(this.url);
    }
    this.url = null;
    this.urlIndex = null;
  }

  editURL(url: string, index: number): void {
    this.url = url;
    this.urlIndex = index;
  }

  removeURL(index: number): void {
    this.createForm.url.splice(index, 1);
  }

  addStep(): void {
    this.createForm.tests.push({
      delimiters: ['<%', '%>'],
      endpoint: null,
      name: null,
      request: {
        method: null,
        uri: null,
        headers: null,
        body: null,
        responseCode: null
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
    }
  }

  delimiterUpdated(event: any): void {
    this.createForm.tests[this.selectedStepIndex].delimiters = event.target.value.split(',');
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
          data => this.selectTest(data._id)
        );
    }
  }

}
