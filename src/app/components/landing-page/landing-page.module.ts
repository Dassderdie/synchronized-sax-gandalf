import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
    declarations: [LandingPageComponent],
    imports: [CommonModule, LandingPageRoutingModule, MatGridListModule],
})
export class LandingPageModule {}
