import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChannelComponent } from './channel.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { VideoSettingsFormComponent } from './video-settings-form/video-settings-form.component';
import { YoutubePlayerModule } from '../player/youtube-player/youtube-player.module';

@NgModule({
    declarations: [ChannelComponent, VideoSettingsFormComponent],
    imports: [
        CommonModule,
        YoutubePlayerModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatAutocompleteModule,
        MatSliderModule,
    ],
    exports: [ChannelComponent],
})
export class ChannelModule {}
