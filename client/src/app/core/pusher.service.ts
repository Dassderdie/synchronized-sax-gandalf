import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PusherService {
    private readonly id = Date.now();
    constructor() {
        const pusher = new Pusher(environment.pusher.key, {
            cluster: environment.pusher.cluster,
            authEndpoint: '.netlify/functions/pusher-auth',
        });

        const channel = pusher.subscribe('private-channel');
        channel.bind('client-event', (data: any) => {
            console.log(data);
        });
        setTimeout(() => {
            console.log(1);

            channel.trigger('client-event', `Hello from ${this.id}`);
        }, 3000);
    }
}
