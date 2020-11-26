import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewRecordComponent } from './new-record.component';

describe('NewRecordComponent', () => {
  let component: NewRecordComponent;
  let fixture: ComponentFixture<NewRecordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
