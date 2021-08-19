import { PresenceChannel } from 'pusher-js';
import { PusherApi } from './pusher-api';
import { SyncTimeMessage } from './sync-time-message';
import { VideoSettings } from './video-settings';

export class Leader extends PusherApi {
    public readonly type = 'Leader';

    constructor(
        readonly channel: PresenceChannel,
        private videoSettings: VideoSettings
    ) {
        super();
        channel.bind('client-syncTime', (message: SyncTimeMessage) => {
            message.leaderTimestamp = Date.now();
            channel.trigger('client-syncTime', message);
        });
        this.setVideoSettings(videoSettings);
        this.channel.bind('pusher:member_added', () => {
            this.sendVideoSettings();
        });
    }

    public async getTimeOffset() {
        return 0;
    }

    public setVideoSettings(videoSettings: VideoSettings) {
        this.videoSettings = videoSettings;
        this.videoSettings$.next(videoSettings);
        this.sendVideoSettings();
    }

    private sendVideoSettings() {
        this.channel.trigger('client-video-settings', this.videoSettings);
    }
}
