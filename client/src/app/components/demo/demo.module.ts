import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoRoutingModule } from './demo-routing.module';
import { DemoComponent } from './demo/demo.component';
import { YoutubePlayerModule } from 'src/app/shared/player/youtube-player/youtube-player.module';

@NgModule({
    declarations: [DemoComponent],
    imports: [CommonModule, DemoRoutingModule, YoutubePlayerModule],
})
export class DemoModule {}
