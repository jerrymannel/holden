import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  testsuites = [];
  selectedTestsuite: any;
  resultSummary = [];
  selectedResultSummary: any;
  results = [];
  selectedResult: any;

  errors = {
    misc: null
  };

  resultSummaryProperties = {
    count: 0,
    page: 1,
    limit: 20
  };

  resultProperties = {
    count: 0,
    page: 1,
    limit: 20
  };

  constructor(
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.__getTestsuites();
  }

  __resetErrors(): void {
    this.errors = {
      misc: null
    };
  }

  __getTestsuites(): void {
    this.__resetErrors();
    this.selectedTestsuite = {};
    this.commonService.get('testsuite', '/', {sort: '_id'})
    .subscribe(
      data => {
        this.testsuites = data;
        if (data.length > 0) {
          this.selectedTestsuite = data[0];
          this.__getResultSummary();
        }
      },
      () => this.errors.misc = 'Error fetching testsuites'
    );
  }

  __getResultSummary(): void {
    this.__resetErrors();
    const options = {
      filter: {
        testSuite: this.selectedTestsuite._id
      },
      sort: '_id',
      page: this.resultSummaryProperties.page,
      limit: this.resultSummaryProperties.limit,
      count: false
    };
    this.commonService.get('resultsummary', '/', options)
    .subscribe(
      data => {
        this.resultSummary = data;
        if (data.length > 0) {
          this.selectedResultSummary = data[0];
          this.__getResults();
        }
      },
      () => this.errors.misc = 'Error fetching result summary'
    );
    options.count = true;
    this.commonService.get('resultsummary', '/', options)
    .subscribe(
      data => this.resultSummaryProperties.count = data,
      () => this.errors.misc = 'Error fetching result summary'
    );
  }

  __getResults(): void {
    this.__resetErrors();
    const options = {
      filter: {
        testSuite: this.selectedTestsuite._id,
        resultSummary: this.selectedResultSummary._id
      },
      sort: 'status,test',
      page: this.resultProperties.page,
      limit: this.resultProperties.limit,
      count: false
    };
    this.commonService.get('result', '/', options)
    .subscribe(
      data => {
        this.results = data;
        if (data.length > 0) {
          this.selectedResult = data[0];
        }
      },
      () => this.errors.misc = 'Error fetching result summary'
    );
    options.count = true;
    this.commonService.get('result', '/', options)
    .subscribe(
      data => this.resultProperties.count = data,
      () => this.errors.misc = 'Error fetching result summary'
    );
  }

  menuClick(ts: any): void {
    this.selectedTestsuite = ts;
    this.__getResultSummary();
  }

  menuClickResultSummary(rs: any): void {
    this.selectedResultSummary = rs;
    this.__getResults();
  }

  menuClickResult(result: any): void {
    this.selectedResult = result;
    const el = document.getElementById('resultView');
    el.scrollIntoView({inline: 'start'});
  }

  runTest(): void {
    console.log(this.selectedTestsuite._id);
  }

  stringifiedData(data: any): string {
    return JSON.stringify(data);
  }

}
