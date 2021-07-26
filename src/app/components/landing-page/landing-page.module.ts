import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProductionPlayerModule } from '../../shared/player/production-player/production-player.module';

@NgModule({
    declarations: [LandingPageComponent],
    imports: [
        CommonModule,
        LandingPageRoutingModule,
        MatExpansionModule,
        MatToolbarModule,
        ProductionPlayerModule,
    ],
})
export class LandingPageModule {}
