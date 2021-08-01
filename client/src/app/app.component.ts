import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { PusherService } from './core/pusher.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(
        private readonly swUpdate: SwUpdate,
        // To initialize the service
        private readonly pusherService: PusherService
    ) {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.checkForUpdate();
        }
    }
}
