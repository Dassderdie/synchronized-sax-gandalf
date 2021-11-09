import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageModule } from './components/landing-page/landing-page.module';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LandingPageModule,
        MatToolbarModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
