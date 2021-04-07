import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonService } from '../../utils/common.service';
import { DatasetString, DatasetNumber, DatasetObject } from '../../utils/interfaces';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {

  selected = 'String';
  showReinitConfirmation = false;
  showAddDataset = false;
  showDeleteDataset = false;
  saveRequiredASCII = false;
  saveRequired = false;

  customView = false;
  customData = null;

  inputDataset = null;
  inputData = null;

  stringData: DatasetString;
  numberData: DatasetNumber;
  dateData: DatasetObject;
  locationData: DatasetObject;
  booleanData: DatasetObject;
  userCreatedData: [DatasetObject];

  errors = {
    create: null,
    fetch: null,
    upsert: null,
    init: null
  };
  spinner = {
    create: false,
    fetch: false,
    upsert: false,
    init: false,
  };

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.menuClick('String');
    this.__loadUserDatasets();
  }

  __resetError(): void {
    this.errors = {
      create: null,
      fetch: null,
      upsert: null,
      init: null
    };
  }

  __resetSpinners(): void {
    this.spinner = {
      create: false,
      fetch: false,
      upsert: false,
      init: false,
    };
  }

  menuClick(selection: string): void {
    this.customView = false;
    this.selected = selection;
    this.saveRequired = false;
    this.spinner.fetch = true;
    this.inputDataset = null;
    this.inputData = null;
    switch (this.selected) {
      case 'String': this.__loadStringData(); break;
      case 'Number': this.__loadNumberData(); break;
      case 'Boolean': this.__loadBooleanData(); break;
      case 'Date': this.__loadDateData(); break;
      case 'Location': this.__loadLocationData(); break;
      default: {
        this.customView = true;
        this.__loadOneUserDatasets(selection);
        break;
      }
    }
  }

  __loadStringData(): void {
    this.commonService.get('dataset', '/String', null)
    .subscribe(
      response => {
        this.stringData = response;
        this.spinner.fetch = false;
      },
      () => {
        this.errors.fetch = true;
        this.spinner.fetch = false;
      }
    );
  }

  __loadNumberData(): void {
    this.commonService.get('dataset', '/Number', null)
    .subscribe(
      response => {
        this.numberData = response;
        this.spinner.fetch = false;
      },
      () => {
        this.errors.fetch = true;
        this.spinner.fetch = false;
      }
    );
  }

  __loadBooleanData(): void {
    this.commonService.get('dataset', '/Boolean', null)
    .subscribe(
      response => {
        this.booleanData = response;
        this.spinner.fetch = false;
      },
      () => {
        this.errors.fetch = true;
        this.spinner.fetch = false;
      }
    );
  }

  __loadDateData(): void {
    this.commonService.get('dataset', '/Date', null)
    .subscribe(
      response => {
        this.dateData = response;
        this.spinner.fetch = false;
      },
      () => {
        this.errors.fetch = true;
        this.spinner.fetch = false;
      }
    );
  }

  __loadLocationData(): void {
    this.commonService.get('dataset', '/Location', null)
    .subscribe(
      response => {
        this.locationData = response;
        this.spinner.fetch = false;
      },
      () => {
        this.errors.fetch = true;
        this.spinner.fetch = false;
      }
    );
  }

  __loadUserDatasets(): void {
    const qs = {
      sort: '_id',
      select: '_id',
      filter: {
        _id: {
          '$nin': [ 'String', 'Number', 'Date', 'Location', 'Boolean' ]
        }
      }
    };
    this.commonService.get('dataset', '/', qs)
    .subscribe(
      response => {
        this.userCreatedData = response;
        this.spinner.fetch = false;
      },
      () => {
        this.errors.fetch = true;
        this.spinner.fetch = false;
      }
    );
  }

  __loadOneUserDatasets(id: string): void {
    this.commonService.get('dataset', `/${id}`, null)
    .subscribe(
      response => {
        this.customData = response;
        this.spinner.fetch = false;
      },
      () => {
        this.errors.fetch = true;
        this.spinner.fetch = false;
      }
    );
  }

  getStringValue(data: any): string {
    return JSON.stringify(data);
  }

  getFormattedStringValue(data: any): string {
    return JSON.stringify(data, null, ' ');
  }

  removeItemFromDataSet(dataset: string, data: string): void {
    switch (dataset) {
      case 'stringData': this.stringData.data.splice(this.stringData.data.indexOf(data), 1); this.saveRequired = true; break;
      case 'numberData': this.numberData.data.splice(this.numberData.data.indexOf(data), 1);  this.saveRequired = true; break;
      case 'dateData': this.dateData.data.splice(this.dateData.data.indexOf(data), 1);  this.saveRequired = true; break;
      case 'locationData': this.locationData.data.splice(this.locationData.data.indexOf(data), 1);  this.saveRequired = true; break;
      case 'booleanData': this.booleanData.data.splice(this.booleanData.data.indexOf(data), 1);  this.saveRequired = true; break;
    }
  }

  saveDataSet(dataset: any): void {
    this.__resetError();
    this.__resetSpinners();
    this.spinner.upsert = true;
    this.commonService.put('dataset', `/${dataset._id}`, dataset)
    .subscribe(
      () => {
        switch (this.selected) {
          case 'String': this.__loadStringData(); break;
          case 'Number': this.__loadNumberData(); break;
          case 'Boolean': this.__loadBooleanData(); break;
          case 'Date': this.__loadDateData(); break;
          case 'Location': this.__loadLocationData(); break;
          default: this.__loadOneUserDatasets(dataset._id); break;
        }
        this.spinner.upsert = false;
        this.saveRequired = false;
        this.saveRequiredASCII = false;
      },
      () => {
        this.errors.upsert = true;
        this.spinner.upsert = false;
      }
    );
  }

  clearData(dataset: string): void {
    switch (dataset) {
      case 'stringData': this.stringData.data = null; break;
      case 'numberData': this.numberData.data = null; break;
      case 'dateData': this.dateData.data = null; break;
      case 'locationData': this.locationData.data = null; break;
      case 'booleanData': this.booleanData.data = null; break;
      default: this.customData.data = null; break;
    }
    this.saveRequired = true;
  }

  reinitData(): void {
    this.__resetError();
    this.__resetSpinners();
    this.saveRequired = false;
    this.saveRequiredASCII = false;
    this.spinner.init = true;
    this.commonService.post('dataset', '/init', null)
    .subscribe(
      () => {
        this.menuClick('String');
        this.spinner.init = false;
        this.showReinitConfirmation = false;
        this.inputData = null;
      },
      () => {
        this.errors.init = true;
        this.spinner.init = false;
      }
    );
  }

  addData(dataset: string): void {
    this.__resetError();
    this.__resetSpinners();
    let id = null;
    let data = null;
    switch (dataset) {
      case 'stringData': id = this.stringData._id; data = JSON.parse(JSON.stringify(this.stringData)); break;
      case 'numberData': id = this.numberData._id; data = JSON.parse(JSON.stringify(this.numberData)); break;
      case 'dateData': id = this.dateData._id; data = JSON.parse(JSON.stringify(this.dateData)); break;
      case 'locationData': id = this.locationData._id; data = JSON.parse(JSON.stringify(this.locationData)); break;
      case 'booleanData': id = this.booleanData._id; data = JSON.parse(JSON.stringify(this.booleanData)); break;
      default: id = this.customData._id; data = JSON.parse(JSON.stringify(this.customData)); break;
    }
    if (!data.data) {
      data.data = [];
    }
    if (['dateData', 'locationData', 'custom'].indexOf(dataset) !== -1 ) {
      try {
        data.data.push(JSON.parse(this.inputData));
      } catch (e) {
        this.errors.upsert = e.message;
        return;
      }
    } else {
      data.data.push(this.inputData);
    }
    this.commonService.put('dataset', `/${id}`, data)
    .subscribe(
      () => {
        this.inputData = null;
        switch (dataset) {
          case 'stringData': this.__loadStringData(); break;
          case 'numberData': this.__loadNumberData(); break;
          case 'dateData': this.__loadDateData(); break;
          case 'locationData': this.__loadLocationData(); break;
          case 'booleanData': this.__loadBooleanData(); break;
          default: this.__loadOneUserDatasets(this.customData._id); break;
        }
      },
      () => {
        this.errors.upsert = true;
        this.spinner.upsert = false;
      }
    );
  }

  createDataSet(): void {
    this.__resetError();
    this.__resetSpinners();
    this.spinner.create = true;
    this.commonService.post('dataset', '/', {_id: this.inputDataset})
    .subscribe(
      () => {
        this.inputDataset = null;
        this.showAddDataset = false;
        this.__loadUserDatasets();
      },
      error => {
        this.errors.create = error.message;
        this.spinner.create = false;
      }
    );
  }

  deleteDataset(id: string): void {
    this.__resetError();
    this.__resetSpinners();
    this.spinner.upsert = true;
    this.commonService.delete('dataset', `/${id}`)
    .subscribe(
      () => {
        this.showDeleteDataset = false;
        this.menuClick('String');
        this.__loadUserDatasets();
      },
      error => {
        this.errors.upsert = error.message;
        this.spinner.upsert = false;
      }
    );
  }

}
