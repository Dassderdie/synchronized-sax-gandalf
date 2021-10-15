import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackByPropertyPipe } from './track-by-property.pipe';

@NgModule({
    declarations: [TrackByPropertyPipe],
    imports: [CommonModule],
    exports: [TrackByPropertyPipe],
})
export class PipesModule {}
