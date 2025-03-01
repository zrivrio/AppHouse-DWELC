import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import { AppComponent } from './app/app.component';
import routeConfig from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideProtractorTestingSupport(), provideRouter(routeConfig), provideHttpClient(withFetch())],
}).catch((err) => console.error(err));