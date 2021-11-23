import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubePlayerComponent } from './youtube-player.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    declarations: [YoutubePlayerComponent],
    imports: [
        CommonModule,
        MatSliderModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatSlideToggleModule,
    ],
    exports: [YoutubePlayerComponent],
})
export class YoutubePlayerModule {}
