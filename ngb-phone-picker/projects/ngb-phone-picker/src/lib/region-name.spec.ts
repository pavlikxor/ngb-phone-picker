import '@angular/compiler';

import {
  createEnvironmentInjector,
  PLATFORM_ID,
  runInInjectionContext,
} from '@angular/core';

import { RegionNameService } from './region-names';

describe('RegionNameService', () => {
  let service: RegionNameService;

  beforeEach(() => {
    const injector = createEnvironmentInjector([
      { provide: PLATFORM_ID, useValue: 'browser' },
    ]);

    service = runInInjectionContext(injector, () => new RegionNameService());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getRegionLocalName('US', 'en')).toBe('United States');
  });
});
