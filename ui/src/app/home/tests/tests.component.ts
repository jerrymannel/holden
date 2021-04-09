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
  deleteConfirmation = false;

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
  }

  __resetForm(): void {
    this.createForm = {
      _id: null,
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
      sort: '_id',
      select: '_id'
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

}
