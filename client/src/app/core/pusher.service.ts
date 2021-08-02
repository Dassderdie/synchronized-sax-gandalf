import { Injectable } from '@angular/core';
import Pusher, { PresenceChannel } from 'pusher-js';
import { environment } from 'src/environments/environment';
import { Follower } from './Follower';
import { Leader } from './Leader';

@Injectable({
    providedIn: 'root',
})
export class PusherService {
    private pusherApi?: Leader | Follower;
    private pusher: Pusher;

    constructor() {
        this.pusher = new Pusher(environment.pusher.key, {
            cluster: environment.pusher.cluster,
            authEndpoint: '.netlify/functions/pusher-auth',
        });
    }

    /**
     * @returns a Promise that resolve ones the connection has been successfully established
     */
    public async initialize(channelId: string, role: 'leader' | 'follower') {
        if (this.pusherApi) {
            this.pusherApi.destroy();
        }
        const channel = this.pusher.subscribe(
            `presence-${channelId}`
        ) as PresenceChannel;
        channel.subscriptionPending;
        if (role === 'leader') {
            this.pusherApi = new Leader(channel);
        } else {
            this.pusherApi = new Follower(channel);
        }
        return new Promise((resolve, reject) =>
            channel.bind('pusher:subscription_succeeded', () => {
                resolve(null);
            })
        );
    }

    public async getTimeOffset() {
        return this.pusherApi?.getTimeOffset();
    }
}

interface Member {
    id: string;
    info: {};
}
