import { PresenceChannel } from 'pusher-js';
import { SyncTimeMessage } from './sync-time-message';

export class Follower {
    constructor(private readonly channel: PresenceChannel) {}

    private timeOffsetPromise?: Promise<number>;
    public async getTimeOffset() {
        if (!this.timeOffsetPromise) {
            this.timeOffsetPromise = new Promise((resolve, reject) => {
                const offsets: number[] = [];
                this.channel.bind(
                    'client-syncTime',
                    (response: SyncTimeMessage) => {
                        if (response.clientId !== this.channel.members.myID) {
                            return;
                        }
                        const receiveTime = Date.now();
                        // Follower.now() + offset = Leader.now()
                        const offset =
                            (response.leaderTimestamp! -
                                response.startFollowerTimestamp +
                                (response.leaderTimestamp! - receiveTime)) /
                            2;
                        offsets.push(offset);
                        if (offsets.length > 5) {
                            const normalizedOffsets = offsets
                                .sort()
                                .slice(1, -2);
                            resolve(
                                normalizedOffsets.reduce(
                                    (sum, current) => sum + current
                                ) / normalizedOffsets.length
                            );
                            this.timeOffsetPromise = undefined;
                            this.channel.unbind('client-syncTime');
                            return;
                        }
                        this.sendSyncTime();
                    }
                );
                this.sendSyncTime();
            });
        }
        return this.timeOffsetPromise;
    }

    private sendSyncTime() {
        const message: SyncTimeMessage = {
            clientId: this.channel.members.myID,
            startFollowerTimestamp: Date.now(),
        };
        this.channel.trigger('client-syncTime', message);
    }
}
