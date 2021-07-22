import { Injectable, NgZone } from '@angular/core';
import { mapValues } from 'lodash-es';

declare global {
    interface Window {
        /**
         * This function is called by YT after the api is ready
         */
        onYouTubeIframeAPIReady: (() => void) | undefined;
    }
}

@Injectable({
    providedIn: 'root',
})
export class YoutubePlayerApiService {
    constructor(private readonly zone: NgZone) {}

    private _createYtPlayer?: (
        elt: HTMLElement,
        options: YT.PlayerOptions
    ) => YT.Player;

    public async createYtPlayer(
        elt: HTMLElement,
        options: YT.PlayerOptions
    ): Promise<YT.Player> {
        if (this._createYtPlayer) {
            return this._createYtPlayer(elt, options);
        }
        // This code loads the IFrame Player API code asynchronously, according to the instructions at
        // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        return new Promise((resolve) => {
            window.onYouTubeIframeAPIReady = () => {
                this._createYtPlayer = (
                    elt: HTMLElement,
                    options: YT.PlayerOptions
                ) =>
                    new YT.Player(elt, {
                        ...options,
                        events: {
                            // run inside the zone
                            ...mapValues(options.events, (handler) =>
                                handler
                                    ? () =>
                                          this.zone.run((event) =>
                                              handler(event)
                                          )
                                    : undefined
                            ),
                        },
                    });
                resolve(this._createYtPlayer(elt, options));
            };
        });
    }
}
