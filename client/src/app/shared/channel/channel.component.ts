import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { PusherService } from 'src/app/core/pusher.service';
import { VideoSettings } from 'src/app/core/video-settings';
import { SynchronizedPlayerConfiguration } from '../player/synchronized-player-configuration';

@Component({
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelComponent {
    constructor(
        public readonly pusherService: PusherService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    public forceLeader = false;
    public channelId = 'abcdef';

    public status: 'idle' | 'starting' | 'started' = 'idle';
    public async start() {
        this.status = 'starting';
        await this.pusherService.initialize(
            this.channelId,
            undefined,
            this.forceLeader
        );
        this.status = 'started';
        this.changeDetectorRef.markForCheck();
        this.syncTime();
    }

    public synchronizedPlayerConfig?: SynchronizedPlayerConfiguration;

    public syncingTime?: Promise<number | undefined>;
    public async syncTime() {
        this.syncingTime = this.pusherService.getTimeOffset();

        const offset = await this.syncingTime;
        this.syncingTime = undefined;
        if (typeof offset !== 'number') {
            console.log('Mode not set!');
            return;
        }
        this.synchronizedPlayerConfig = {
            ...new SynchronizedPlayerConfiguration(),
            synchronisationOffset: offset,
        };
        this.changeDetectorRef.markForCheck();
    }

    public setVideoSettings(newVideoSettings: VideoSettings) {
        this.pusherService.setVideoSettings(cloneDeep(newVideoSettings));
    }

    public setVideoTimeOffset(
        videoSettings: VideoSettings,
        videoTimeOffset: number
    ) {
        this.setVideoSettings({ ...videoSettings, videoTimeOffset });
    }
}
