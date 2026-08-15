import { TestBed } from '@angular/core/testing';

import { RegionNameService } from './region-names';

describe('RegionNameService', () => {
  let service: RegionNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
