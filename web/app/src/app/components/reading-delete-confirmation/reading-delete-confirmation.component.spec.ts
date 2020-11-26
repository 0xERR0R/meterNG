import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReadingDeleteConfirmationComponent } from './reading-delete-confirmation.component';

describe('ReadingDeleteConfirmationComponent', () => {
  let component: ReadingDeleteConfirmationComponent;
  let fixture: ComponentFixture<ReadingDeleteConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadingDeleteConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
