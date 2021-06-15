import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  tests = [];
  selectedTestID = null;
  selectedResultID = null;
  selectedTest = null;

  listOfResultSummary = [];
  resultSummary: any;
  results = [];
  selectedResultIndex = 0;

  errorTest = null

  requestTab = 1;
  responseTab = 1;


  constructor(
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.__getTests();
  }

  __getTests(): void {
    this.errorTest = null
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
        () => this.errorTest = 'Error fetching tests'
      );
  }

  selectTest(testID: string): void {
    this.selectedTestID = testID;
    this.commonService.get('test', `/${testID}`, null)
      .subscribe(
        test => {
          this.selectedTest = test;
          this.findAllResultSummary(test._id)
        },
        () => this.errorTest = 'Error fetching details of ' + testID
      );
  }

  findAllResultSummary(_testID: string): void {
    this.listOfResultSummary = []
    let options = {
      filter: {
        testID: _testID
      }
    }
    this.commonService.get('resultsummary', `/`, options)
      .subscribe(
        summary => {
          this.listOfResultSummary = summary;
          if (this.listOfResultSummary.length > 0) {
            this.selectedResultID = this.listOfResultSummary[0]._id
            this.fetchResult(this.selectedResultID)
          }
        },
        () => this.errorTest = 'Error fetching result summaries for test '
      );
  }

  fetchResult(resultID: number): void {
    this.results = [];
    this.selectedResultID = resultID;
    this.listOfResultSummary.forEach(summary => {
      if (summary._id == resultID) this.resultSummary = summary
    })
    let options = {
      filter: {
        "_id.resultID": resultID
      }
    }
    this.selectedResultIndex = 0;
    this.commonService.get('result', `/`, options)
      .subscribe(
        results => this.results = results,
        () => this.errorTest = 'Error fetching results for test '
      );
  }

  stringify(data: any): string {
    return JSON.stringify(data, null, " ");
  }

}
