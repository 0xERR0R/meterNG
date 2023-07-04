import { TestBed } from '@angular/core/testing';

import { MeterService } from './meter.service';

describe('MeterService', () => {
  let service: MeterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
