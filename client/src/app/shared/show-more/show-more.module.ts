import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShowMoreComponent } from './show-more/show-more.component';

@NgModule({
    declarations: [ShowMoreComponent],
    imports: [CommonModule],
    exports: [ShowMoreComponent],
})
export class ShowMoreModule {}
