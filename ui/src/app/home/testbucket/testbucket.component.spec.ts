import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestbucketComponent } from './testbucket.component';

describe('TestbucketComponent', () => {
  let component: TestbucketComponent;
  let fixture: ComponentFixture<TestbucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestbucketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestbucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
