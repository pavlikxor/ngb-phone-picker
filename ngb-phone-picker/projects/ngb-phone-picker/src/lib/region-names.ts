import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';

@Service()
export class RegionNameService {
  private platformId = inject(PLATFORM_ID);

  private getBrowserLang(): string {
    return isPlatformBrowser(this.platformId)
      ? navigator.language.split('-')[0]
      : 'en'; // 'en' - Fallback for SSR
  }

  getRegionLocalName(
    regionCode: string,
    regionLang?: string,
  ): string | undefined {
    const prefix = regionCode.split('-')[0];
    return new Intl.DisplayNames([regionLang || this.getBrowserLang()], {
      type: 'region',
    }).of(prefix);
  }
}
