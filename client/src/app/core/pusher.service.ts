import { Injectable } from '@angular/core';
import Pusher, { PresenceChannel } from 'pusher-js';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Follower } from './Follower';
import { Leader } from './Leader';
import { VideoSettings } from './video-settings';

@Injectable({
    providedIn: 'root',
})
export class PusherService {
    private pusherApi?: Leader | Follower;
    private pusher: Pusher;
    public readonly type$ = new ReplaySubject<'Follower' | 'Leader'>(1);
    public readonly numberOfMembers$ = new ReplaySubject<number>(1);
    public readonly videoSettings$ = new ReplaySubject<VideoSettings>(1);

    constructor() {
        this.pusher = new Pusher(environment.pusher.key, {
            cluster: environment.pusher.cluster,
            authEndpoint: '.netlify/functions/pusher-auth',
        });
        this.videoSettings$.subscribe((a) => console.log(a));
    }

    /**
     * @returns a Promise that resolve ones the connection has been successfully established
     * @param forceLeader wether the role should be forced to be a leader
     */
    public async initialize(
        channelId: string,
        videoSettings: VideoSettings,
        forceLeader?: boolean
    ) {
        if (this.pusherApi) {
            this.pusherApi.destroy();
        }
        const channel = this.pusher.subscribe(
            `presence-${channelId}`
        ) as PresenceChannel;
        return new Promise((resolve, reject) =>
            channel.bind('pusher:subscription_succeeded', () => {
                // TODO: there are many edge cases where this could go wrong
                if (channel.members.count === 1 || forceLeader) {
                    this.pusherApi = new Leader(channel, videoSettings);
                } else {
                    this.pusherApi = new Follower(channel);
                }
                this.pusherApi.videoSettings$.subscribe(this.videoSettings$);
                this.type$.next(this.pusherApi.type);
                this.numberOfMembers$.next(channel.members.count);
                channel.bind('pusher:member_added', () =>
                    this.numberOfMembers$.next(channel.members.count)
                );
                channel.bind('pusher:member_removed', () =>
                    this.numberOfMembers$.next(channel.members.count)
                );
                resolve(null);
            })
        );
    }

    public async getTimeOffset() {
        return this.pusherApi?.getTimeOffset();
    }

    public setVideoSettings(videoSettings: VideoSettings) {
        assert(this.pusherApi?.type === 'Leader');
        this.pusherApi.setVideoSettings(videoSettings);
    }
}
