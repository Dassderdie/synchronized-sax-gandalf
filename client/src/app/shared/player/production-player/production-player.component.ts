import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { PusherService } from 'src/app/core/pusher.service';
import { SynchronizedPlayerConfiguration } from '../synchronized-player-configuration';

@Component({
    selector: 'app-production-player',
    templateUrl: './production-player.component.html',
    styleUrls: ['./production-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionPlayerComponent {
    constructor(private readonly pusherService: PusherService) {}

    public videoId = 'BBGEG21CGo0';
    public isPaused = true;
    public fullscreen$ = new Subject();
    public config = new SynchronizedPlayerConfiguration();

    public syncingTime?: Promise<number>;
    public async syncTime() {
        this.syncingTime = this.pusherService.getTimeOffset();
        const offset = await this.syncingTime;
        console.log(offset);
        this.config = {
            ...this.config,
            synchronisationOffset: offset,
        };
        this.syncingTime = undefined;
    }
}
