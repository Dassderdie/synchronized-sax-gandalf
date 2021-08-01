import { Injectable } from '@angular/core';
import Pusher, { Channel } from 'pusher-js';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PusherService {
    constructor() {
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        const pusher = new Pusher(environment.pusher.key, {
            cluster: process.env.PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', (data: any) => {
            console.log(data);
        });
    }
}
