import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertsComponent } from './alerts/alerts.component';
import { MessageBodyComponent } from './message-body/message-body.component';
import { ToastsComponent } from './toasts/toasts.component';
import { CustomTimerProgressBarComponent } from './custom-timer-progress-bar/custom-timer-progress-bar.component';
import { LogToStringPipe } from './log-to-string.pipe';
import { ShowMoreModule } from 'src/app/shared/show-more/show-more.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
    imports: [CommonModule, ShowMoreModule, PipesModule],
    declarations: [
        AlertsComponent,
        ToastsComponent,
        MessageBodyComponent,
        CustomTimerProgressBarComponent,
        LogToStringPipe,
    ],
    exports: [AlertsComponent, ToastsComponent],
})
export class MessagesModule {}
