import { ChangeDetectorRef, NgZone } from '@angular/core';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SynchronizedPlayer } from './synchronized-player';

declare global {
    interface Window {
        /**
         * This function is called by YT after the api is ready
         */
        onYouTubeIframeAPIReady: (() => void) | undefined;
    }
}

@Component({
    selector: 'app-youtube-player',
    templateUrl: './youtube-player.component.html',
    styleUrls: ['./youtube-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubePlayerComponent implements OnInit {
    public readonly videoId = 'BBGEG21CGo0';
    public readonly synchronisationOffset = 0;

    private player?: YT.Player;
    public synchronizedPlayer?: SynchronizedPlayer;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly zone: NgZone
    ) {}

    ngOnInit(): void {
        // TODO: make sure this only happens once
        // This code loads the IFrame Player API code asynchronously, according to the instructions at
        // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        window.onYouTubeIframeAPIReady = () => {
            this.player = new YT.Player('ytPlayerPlaceholder', {
                height: '390',
                width: '640',
                videoId: this.videoId,
                playerVars: {
                    // TODO: change to enums (currently they are not correctly transpiled to js?)
                    controls: 0,
                    disablekb: 1,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    loop: 1,
                    // necessary to make the looping work
                    playlist: this.videoId,
                },
                events: {
                    onReady: this.onPlayerReady.bind(this),
                },
            });
        };
    }

    private onPlayerReady(event: YT.PlayerEvent) {
        // onYouTubeIframeAPIReady ran outside the zone
        this.zone.run(() => {
            assert(!!this.player);
            this.player.pauseVideo();
            this.synchronizedPlayer = new SynchronizedPlayer(
                this.synchronisationOffset,
                () => {
                    const duration = this.player!.getDuration() * 1000;
                    assert(0 < duration);
                    return duration;
                },
                (seconds) => this.player!.seekTo(seconds, true),
                () => this.player!.getCurrentTime() * 1000,
                () => this.player!.playVideo(),
                () => this.player!.pauseVideo()
            );
            // because onPlayerReady is no event patched by zone.js
            this.changeDetectorRef.detectChanges();
        });
    }

    public synchronize() {
        this.synchronizedPlayer?.play();
    }

    public pause() {
        this.synchronizedPlayer?.pause();
    }

    ngOnDestroy() {
        this.synchronizedPlayer?.destroy();
    }
}
