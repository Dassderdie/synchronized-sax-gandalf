import { Injectable } from '@angular/core';
import Pusher, { PresenceChannel } from 'pusher-js';
import { environment } from 'src/environments/environment';
import { Follower } from './Follower';
import { Leader } from './Leader';

@Injectable({
    providedIn: 'root',
})
export class PusherService {
    public channelId = 'abcde';
    private pusherApi: Leader | Follower;

    constructor() {
        const pusher = new Pusher(environment.pusher.key, {
            cluster: environment.pusher.cluster,
            authEndpoint: '.netlify/functions/pusher-auth',
        });

        const channel = pusher.subscribe(
            `presence-${this.channelId}`
        ) as PresenceChannel;
        if (channel.members.count === 0) {
            this.pusherApi = new Leader(channel);
        } else {
            this.pusherApi = new Follower(channel);
        }
    }

    public getTimeOffset() {
        return this.pusherApi.getTimeOffset();
    }
}

interface Member {
    id: string;
    info: {};
}
