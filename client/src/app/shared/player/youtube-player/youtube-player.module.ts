import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubePlayerComponent } from './youtube-player.component';

@NgModule({
    declarations: [YoutubePlayerComponent],
    imports: [CommonModule],
    exports: [YoutubePlayerComponent],
})
export class YoutubePlayerModule {}
