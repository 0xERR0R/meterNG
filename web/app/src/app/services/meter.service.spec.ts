import { TestBed } from '@angular/core/testing';

import { MeterService } from './meter.service';

describe('MeterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeterService = TestBed.get(MeterService);
    expect(service).toBeTruthy();
  });
});
