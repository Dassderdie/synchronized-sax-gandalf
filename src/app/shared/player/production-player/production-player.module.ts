import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionPlayerComponent } from './production-player.component';
import { YoutubePlayerModule } from '../youtube-player/youtube-player.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [ProductionPlayerComponent],
    imports: [CommonModule, YoutubePlayerModule, MatInputModule, FormsModule],
    exports: [ProductionPlayerComponent],
})
export class ProductionPlayerModule {}
