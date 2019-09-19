import {TestBed} from '@angular/core/testing';

import {TranslatedNotificationService} from './translated-notification.service';

describe('TranslatedNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranslatedNotificationService = TestBed.get(TranslatedNotificationService);
    expect(service).toBeTruthy();
  });
});
