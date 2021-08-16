import { PresenceChannel } from 'pusher-js';
import { ReplaySubject } from 'rxjs';
import { VideoSettings } from './video-settings';

export abstract class PusherApi {
    abstract readonly type: string;
    abstract readonly channel: PresenceChannel;
    public videoSettings$ = new ReplaySubject<VideoSettings>(1);

    public abstract getTimeOffset(): Promise<any>;

    public destroy() {
        this.channel.disconnect();
    }
}
