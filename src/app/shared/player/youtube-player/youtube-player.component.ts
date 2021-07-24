import {
    AfterViewInit,
    ChangeDetectorRef,
    ElementRef,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { Input } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SynchronizedPlayerConfiguration } from '../synchronized-player-configuration';
import { SynchronizedPlayer } from './../synchronized-player';
import { YoutubePlayerApiService } from './youtube-player-api.service';

@Component({
    selector: 'app-youtube-player',
    templateUrl: './youtube-player.component.html',
    styleUrls: ['./youtube-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubePlayerComponent implements AfterViewInit, OnChanges {
    @Input() videoId!: string;
    @Input() synchronizedPlayerConfig?: SynchronizedPlayerConfiguration;

    @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
    @ViewChild('playerPlaceholder')
    playerPlaceholder!: ElementRef<HTMLDivElement>;
    private player?: YT.Player;
    public synchronizedPlayer?: SynchronizedPlayer;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly youtubePlayerApiService: YoutubePlayerApiService
    ) {}

    async ngAfterViewInit() {
        const containerWidth = this.containerRef.nativeElement.clientWidth;
        this.player = await this.youtubePlayerApiService.createYtPlayer(
            this.playerPlaceholder.nativeElement,
            {
                width: containerWidth.toString(),
                height: (containerWidth / (16 / 9)).toString(),
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
            }
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.videoId && this.player) {
            this.player.loadVideoById(this.videoId);
        }
        if (changes.synchronizedPlayerConfig && this.player) {
            this.initSynchronizedPlayer();
        }
    }

    private onPlayerReady(event: YT.PlayerEvent) {
        assert(!!this.player);
        this.player.pauseVideo();
        this.initSynchronizedPlayer();
        // because onPlayerReady is no event patched by zone.js
        this.changeDetectorRef.detectChanges();
    }

    public initSynchronizedPlayer() {
        this.synchronizedPlayer?.destroy();
        this.synchronizedPlayer = new SynchronizedPlayer(
            this.synchronizedPlayerConfig ??
                new SynchronizedPlayerConfiguration(),
            () => {
                const duration = this.player!.getDuration() * 1000;
                assert(0 < duration);
                return duration;
            },
            (ms) => this.player!.seekTo(ms / 1000, true),
            () => this.player!.getCurrentTime() * 1000,
            () => this.player!.playVideo(),
            () => this.player!.pauseVideo()
        );
    }

    public pause() {
        this.synchronizedPlayer?.pause();
    }

    ngOnDestroy() {
        this.synchronizedPlayer?.destroy();
    }
}
