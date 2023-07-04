import { TestBed } from '@angular/core/testing';

import { ReadingsService } from './readings.service';

describe('ReadingsService', () => {
  let service: ReadingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
