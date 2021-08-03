import { PresenceChannel } from 'pusher-js';
import { PusherApi } from './pusher-api';
import { SyncTimeMessage } from './sync-time-message';

export class Leader extends PusherApi {
    public readonly type = 'Leader';

    constructor(readonly channel: PresenceChannel, private videoId: string) {
        super();
        channel.bind('client-syncTime', (message: SyncTimeMessage) => {
            message.leaderTimestamp = Date.now();
            channel.trigger('client-syncTime', message);
        });
        this.setVideoId(videoId);
        this.channel.bind('pusher:member_added', () => {
            this.sendVideoId();
        });
    }

    public async getTimeOffset() {
        return 0;
    }

    public setVideoId(videoId: string) {
        this.videoId = videoId;
        this.videoId$.next(videoId);
        this.sendVideoId();
    }

    private sendVideoId() {
        this.channel.trigger('client-video', {
            videoId: this.videoId,
        });
    }
}
