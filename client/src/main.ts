import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { assert as assertFct } from './app/utilities/assert';
import { ErrorsManager } from './app/core/errors/errors-manager';

// add the global assert function (simplifies typescript assertions a lot)
declare global {
    const assert: typeof assertFct;
    /**
     * The object used for custom error handling
     * - you can use it in any components to easily e.g.
     * throw errors and inform the user / developer about it
     */
    const errors: ErrorsManager;
}
(window as any).assert = assertFct;
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-var
(window as any).errors = new ErrorsManager();

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
