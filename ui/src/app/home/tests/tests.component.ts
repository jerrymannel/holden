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
    tests: [
      {
        delimiters: ['<%', '%>'],
        endpoint: null,
        name: null,
        request: {
          method: null,
          url: null,
          headers: null,
          payload: null,
          payloadFile: null,
          responseCode: null,
          saveResponse: null
        },
        response: {
          headers: null,
          body: null,
          bodyFile: null,
        }
      }
    ]
  };

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
      tests: [
        {
          delimiters: ['<%', '%>'],
          endpoint: null,
          name: null,
          request: {
            method: null,
            url: null,
            headers: null,
            payload: null,
            payloadFile: null,
            responseCode: null,
            saveResponse: null
          },
          response: {
            headers: null,
            body: null,
            bodyFile: null,
          }
        }
      ]
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
  }

  selectTest(testID: string): void {
    this.selectedTestID = testID;
    this.commonService.get('test', `/${testID}`, null)
      .subscribe(
        test => {
          this.createForm = JSON.parse(JSON.stringify(test));
        },
        () => this.errors.fetch = 'Error fetching details of ' + testID
      );
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
          this.__getTests();
        },
        () => this.errors.createUpdate = 'Error deleting test ' + this.createForm._id
      );
  }

}
