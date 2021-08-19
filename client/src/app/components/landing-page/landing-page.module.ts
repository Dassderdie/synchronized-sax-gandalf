import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChannelModule } from 'src/app/shared/channel/channel.module';

@NgModule({
    declarations: [LandingPageComponent],
    imports: [
        CommonModule,
        LandingPageRoutingModule,
        MatExpansionModule,
        ChannelModule,
    ],
})
export class LandingPageModule {}
