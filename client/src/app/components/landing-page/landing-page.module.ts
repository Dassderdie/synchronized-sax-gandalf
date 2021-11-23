import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { ChannelModule } from 'src/app/shared/channel/channel.module';

@NgModule({
    declarations: [LandingPageComponent],
    imports: [CommonModule, LandingPageRoutingModule, ChannelModule],
})
export class LandingPageModule {}
