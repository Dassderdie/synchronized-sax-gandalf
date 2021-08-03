import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionPlayerModule } from '../player/production-player/production-player.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChannelComponent } from './channel.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
    declarations: [ChannelComponent],
    imports: [
        CommonModule,
        ProductionPlayerModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatAutocompleteModule,
    ],
    exports: [ChannelComponent],
})
export class ChannelModule {}
