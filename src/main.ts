import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { assert as assertFct } from './app/utilities/assert';

// add the global assert function (simplifies typescript assertions a lot)
declare global {
    const assert: typeof assertFct;
}
(window as any).assert = assertFct;

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
