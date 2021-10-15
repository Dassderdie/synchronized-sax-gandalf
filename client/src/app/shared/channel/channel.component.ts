import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { PusherService } from 'src/app/core/pusher.service';
import { ShareService } from 'src/app/core/share/share.service';
import { VideoSettings } from 'src/app/core/video-settings';

@Component({
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelComponent {
    constructor(
        public readonly pusherService: PusherService,
        public readonly shareService: ShareService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    public forceLeader = false;
    public channelId = 'abcdef';
    public readonly recommendedVideoIds = [
        'BBGEG21CGo0',
        's4lyelymLac',
        'jRA1HBZhJ18',
    ];

    public status: 'idle' | 'starting' | 'started' = 'idle';
    public async start() {
        this.status = 'starting';
        await this.pusherService.initialize(
            this.channelId,
            this.newVideoSettings,
            this.forceLeader
        );
        this.status = 'started';
        this.changeDetectorRef.markForCheck();
        this.syncTime();
    }

    public newVideoSettings: VideoSettings = {
        videoId: this.recommendedVideoIds[0],
        volume: 100,
    };
    public systemTimeOffset?: number;
    public syncingTime?: Promise<number | undefined>;
    public async syncTime() {
        this.syncingTime = this.pusherService.getTimeOffset();

        const offset = await this.syncingTime;
        this.syncingTime = undefined;
        if (typeof offset !== 'number') {
            console.log('Mode not set!');
            return;
        }
        this.systemTimeOffset = offset;
        this.changeDetectorRef.markForCheck();
    }

    public setVideoSettings() {
        this.pusherService.setVideoSettings(cloneDeep(this.newVideoSettings));
    }
}
