import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'src/app/core/messages/message.service';
import { fade } from 'src/app/shared/animations/fade';
@Component({
    selector: 'app-toasts',
    templateUrl: './toasts.component.html',
    styleUrls: ['./toasts.component.scss'],
    animations: [fade()],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastsComponent {
    constructor(public readonly messageService: MessageService) {}
}
