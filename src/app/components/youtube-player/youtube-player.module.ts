import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoutubePlayerRoutingModule } from './youtube-player-routing.module';
import { YoutubePlayerComponent } from './youtube-player.component';

@NgModule({
    declarations: [YoutubePlayerComponent],
    imports: [CommonModule, YoutubePlayerRoutingModule],
})
export class YoutubePlayerModule {}
