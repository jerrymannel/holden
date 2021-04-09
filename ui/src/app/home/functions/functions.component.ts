import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/utils/common.service';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.scss']
})
export class FunctionsComponent implements OnInit {

  functions = [];
  selectedFunction: any;

  fnCreate = {
    _id: null,
    data: null
  };
  showCreateForm = false;
  showDeleteConfirmation = false;

  errors = {
    fetch: null,
    createUpdate: null,
  };

  constructor(
    private commonservices: CommonService
  ) { }

  ngOnInit(): void {
    this.__getFunctions();
  }

  __resetErrors(): void {
    this.errors = {
      fetch: null,
      createUpdate: null,
    };
  }

  __getFunctions(): void {
    this.__resetErrors();
    this.commonservices.get('function', '/', { sort: '_id' })
      .subscribe(
        functions => {
          this.functions = functions;
          if (functions.length > 0) {
            this.selectFunction(functions[0]);
          }
        },
        () => this.errors.fetch = 'Error fetching functions'
      );
  }

  selectFunction(fn: any): void {
    this.selectedFunction = fn;
    this.fnCreate = JSON.parse(JSON.stringify(this.selectedFunction));
  }

  showForm(): void {
    this.selectedFunction = null;
    this.showCreateForm = true;
    this.fnCreate = {
      _id: null,
      data: null
    };
    this.__resetErrors();
  }

  addFunction(): void {
    this.__resetErrors();
    this.commonservices.post('function', '/', this.fnCreate)
      .subscribe(
        () => {
          this.__getFunctions();
          this.showCreateForm = true;
        },
        () => this.errors.createUpdate = 'Error creating function'
      );
  }

  updateFunction(): void {
    this.__resetErrors();
    this.commonservices.put('function', `/${this.fnCreate._id}`, this.fnCreate)
      .subscribe(
        () => {
          this.__getFunctions();
          this.showCreateForm = true;
        },
        () => this.errors.createUpdate = 'Error updating function'
      );
  }

  deleteFunction(): void {
    this.__resetErrors();
    this.commonservices.delete('function', `/${this.selectedFunction._id}`)
      .subscribe(
        () => {
          this.__getFunctions();
          this.showDeleteConfirmation = false;
        },
        () => this.errors.createUpdate = 'Error updating function'
      );
  }

}
