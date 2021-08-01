import { PresenceChannel } from 'pusher-js';
import { SyncTimeMessage } from './sync-time-message';

export class Leader {
    constructor(private readonly channel: PresenceChannel) {
        channel.bind('client-syncTime', (message: SyncTimeMessage) => {
            message.leaderTimestamp = Date.now();
            channel.trigger('client-syncTime', message);
        });
    }

    public async getTimeOffset() {
        return 0;
    }
}
