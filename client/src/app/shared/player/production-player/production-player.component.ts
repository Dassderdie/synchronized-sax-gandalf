import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
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
    constructor(
        public readonly pusherService: PusherService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    public forceLeader = false;
    public channelId = 'abcdef';

    public started = false;
    public async start() {
        await this.pusherService.initialize(this.channelId, this.forceLeader);
        this.started = true;
        this.changeDetectorRef.markForCheck();
        this.syncTime();
    }

    public videoId = 'BBGEG21CGo0';
    public isPaused = true;
    public fullscreen$ = new Subject();
    public config = new SynchronizedPlayerConfiguration();

    public syncingTime?: Promise<number | undefined>;
    public async syncTime() {
        this.syncingTime = this.pusherService.getTimeOffset();

        const offset = await this.syncingTime;
        console.log(offset);
        this.syncingTime = undefined;
        if (typeof offset !== 'number') {
            console.log('Mode not set!');
            return;
        }
        this.config = {
            ...this.config,
            synchronisationOffset: offset,
        };
        this.changeDetectorRef.markForCheck();
    }
}
