import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubePlayerComponent } from './youtube-player.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [YoutubePlayerComponent],
    imports: [CommonModule, MatSliderModule, FormsModule],
    exports: [YoutubePlayerComponent],
})
export class YoutubePlayerModule {}
