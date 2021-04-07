import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {

  addView = false;
  formEnvironment: FormGroup;
  environments = [];
  selectedEnvironment = null;
  appList = [];
  dataserviceList = [];
  selectedApp: string;
  selectedDataservices = [];
  editMode = false;
  deleteConfirmation = false;
  errors = {
    get: null,
    remove: null,
    add: null,
    app: null,
    dataservice: null,
  };
  spinner = {
    get: false,
    remove: false,
    add: false,
    fetchApp: false,
    fetchDataService: false,
  };
  addSuccess = true;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) {
    this.formEnvironment = this.fb.group({
      _id: ['', Validators.required],
      url: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      app: ['', Validators.required],
      dataservices: [this.fb.group({
        _id: ['', Validators.required],
        name: ['', Validators.required],
      }), [Validators.minLength(1), Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getEnvironments();
  }

  _resetError(): void {
    this.errors = {
      get: null,
      remove: null,
      add: null,
      app: null,
      dataservice: null,
    };
  }

  _resetSpinners(): void {
    this.spinner = {
      get: false,
      remove: false,
      add: false,
      fetchApp: false,
      fetchDataService: false
    };
  }

  showAddEnvironment(edit: boolean): void {
    this._resetError();
    this._resetSpinners();
    this.addView = true;
    this.formEnvironment.reset();
    this.selectedApp = null;
    this.selectedDataservices = null;
    this.appList = [];
    this.dataserviceList = [];
    this.editMode = false;
    if (edit) {
      this.formEnvironment.patchValue(this.selectedEnvironment);
      this.fetchApps();
      this.editMode = true;
      this.selectedApp = this.selectedEnvironment.app;
      this.appSelect(this.selectedApp);
    }
  }

  cancelAddEnvironment(): void {
    this._resetError();
    this._resetSpinners();
    this.addView = false;
    this.formEnvironment.reset();
    this.selectedApp = null;
    this.selectedDataservices = null;
  }

  getEnvironments(): void {
    this.commonService.get('environment', '/', {sort: '_id'})
    .subscribe(
      response => {
        this._resetSpinners();
        this.environments = response;
        this.selectedEnvironment = this.environments[0];
      },
      () => {
        this.errors.get = 'Error fetching environments';
        this._resetSpinners();
      }
    );
  }

  setEnvironment(environment: object): void {
    this.selectedEnvironment = environment;
    this.selectedApp = null;
    this.selectedDataservices = null;
    this.appList = [];
    this.dataserviceList = [];
    this.editMode = false;
    this.addView = false;
  }

  addEnvironment(): void {
    const payload = this.formEnvironment.value;
    this.spinner.add = true;
    let request = null;
    if (this.editMode) {
      request = this.commonService.put('environment', `/${this.selectedEnvironment._id}`, payload);
    } else {
      request = this.commonService.post('environment', '/', payload);
    }
    request.subscribe(
      () => {
        this.spinner.add = false;
        this.addSuccess = true;
        this.addView = false;
        this.getEnvironments();
      },
      () => {
        this.errors.add = true;
        this._resetSpinners();
      }
    );
  }

  deleteEnvironment(id: string): void {
    this.spinner.remove = true;
    this.commonService.delete('environment', `/${id}`)
    .subscribe(
      () => {
        this.spinner.remove = false;
        this.getEnvironments();
        this.deleteConfirmation = false;
      },
      () => {
        this.errors.remove = true;
        this._resetSpinners();
        this.deleteConfirmation = false;
      }
    );
  }

  fetchApps(): void {
    const payload = this.formEnvironment.value;
    this.spinner.fetchApp = true;
    this._resetError();
    this.commonService.get('environment', '/fetch/apps', payload)
    .subscribe(
      response => {
        if (response.length < 1) {
          return this.errors.app = 'No apps found';
        }
        this.appList = response;
        this.selectedDataservices = null;
        if (this.editMode) {
          this.selectedDataservices = this.selectedEnvironment.dataservices;
        }
        this._resetSpinners();
      },
      () => {
        this.errors.app = 'Error fetching apps';
        this._resetSpinners();
      }
    );
  }

  appSelect(selectedApp: string): void {
    this._resetError();
    this.spinner.fetchDataService = true;
    this.formEnvironment.patchValue({app: selectedApp});
    this.selectedApp = selectedApp;
    const payload = this.formEnvironment.value;
    this.selectedDataservices = [];
    this.dataserviceList = [];
    this.commonService.get('environment', '/fetch/dataservices', payload)
    .subscribe(
      response => {
        if (response.length < 1) {
          return this.errors.dataservice = 'No dataservices found';
        }
        this.dataserviceList = response;
        if (this.editMode && selectedApp === this.selectedEnvironment.app) {
          this.selectedDataservices = this.selectedEnvironment.dataservices;
        }
        this._resetSpinners();
      },
      () => {
        this.errors.dataservice = 'Error fetching dataservices';
        this._resetSpinners();
      }
    );
  }

  dataServiceSelect(selectedDataservice: any): void {
    let dsIndex = -1;
    this.selectedDataservices.forEach((ds, index) => {
      if (ds._id === selectedDataservice._id ) {
        dsIndex = index;
      }
    });
    if (dsIndex === -1 ) {
      this.selectedDataservices.push(selectedDataservice);
    } else {
      this.selectedDataservices.splice(dsIndex, 1);
    }
  }

  dataServiceHasBeenSelected(id: string): boolean {
    let flag = false;
    this.selectedDataservices.forEach(ds => {
      if (ds._id === id ) {
        flag = true;
      }
    });
    return flag;
  }

  activateSaveButton(): boolean {
    this.formEnvironment.patchValue({ dataservices: JSON.parse(JSON.stringify(this.selectedDataservices)) });
    return this.formEnvironment.valid;
  }

}
