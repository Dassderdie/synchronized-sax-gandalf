import { PresenceChannel } from 'pusher-js';
import { ReplaySubject } from 'rxjs';

export abstract class PusherApi {
    abstract readonly type: string;
    abstract readonly channel: PresenceChannel;
    public videoId$ = new ReplaySubject<string>(1);

    public abstract getTimeOffset(): Promise<any>;

    public destroy() {
        this.channel.disconnect();
    }
}
