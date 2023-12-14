import {ApplicationRef, enableProdMode} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {enableDebugTools} from "@angular/platform-browser";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then((module) => {
      const applicationRef = module.injector.get(ApplicationRef);
      const componentRef = applicationRef.components[0];

      // const originalTick = applicationRef.tick;
      // applicationRef.tick = function () {
      // 	const windowPerfomance = window.performance;
      // 	const before = windowPerfomance.now();
      // 	const retValue = originalTick.apply(this, arguments);
      // 	const after = windowPerfomance.now();
      // 	const runTime = after - before;
      // 	window.console.log('CHANGE DETECTION TIME', runTime);
      // 	return retValue;
      // };

      return enableDebugTools(componentRef);
    })
  .catch(err => console.error(err));
