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
  selectedTest = null;

  resultSummary = []

  errorTest = null


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
    this.resultSummary = []
    let options = {
      filter: {
        testID: _testID
      }
    }
    this.commonService.get('resultsummary', `/`, options)
      .subscribe(
        summary => this.resultSummary = summary,
        () => this.errorTest = 'Error fetching result summaries for test '
      );
  }

}
