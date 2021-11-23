import {
    AfterViewInit,
    ChangeDetectorRef,
    ElementRef,
    EventEmitter,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { Input } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { VideoSettings } from 'src/app/core/video-settings';
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
    @Input() enableVideoSettingsEditing!: boolean;
    @Input() videoSettings!: VideoSettings;
    @Input() synchronizedPlayerConfig?: SynchronizedPlayerConfiguration;
    @Output() newVideoTimeOffset = new EventEmitter<number>();

    @ViewChild('container') private containerRef!: ElementRef<HTMLDivElement>;
    @ViewChild('playerPlaceholder')
    private playerPlaceholder!: ElementRef<HTMLDivElement>;

    private player?: YT.Player;
    private resizeObserver?: ResizeObserver;
    private destroyed = new Subject();
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
                videoId: this.videoSettings.videoId,
                playerVars: {
                    // TODO: change to enums (currently they are not correctly transpiled to js?)
                    controls: 0,
                    disablekb: 1,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    loop: 1,
                    // necessary to make the looping work
                    playlist: this.videoSettings.videoId,
                },
                events: {
                    onReady: this.onPlayerReady.bind(this),
                },
            }
        );
        this.resizeObserver = new ResizeObserver((entries) => {
            this.updateSize();
        });
        this.resizeObserver.observe(this.containerRef.nativeElement);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.videoSettings && this.player) {
            this.player.loadVideoById(this.videoSettings);
            if (this.isPaused) {
                this.player.pauseVideo();
            }
            this.player.setVolume(this.videoSettings.volume);
        }
        if (
            (changes.synchronizedPlayerConfig ||
                changes.videoSettings?.currentValue.videoTimeOffset !==
                    changes.videoSettings?.previousValue.videoTimeOffset) &&
            this.player
        ) {
            this.initSynchronizedPlayer();
        }
        if (changes.fullscreen$) {
            assert(changes.fullscreen$.isFirstChange());
        }
    }

    public isPaused = true;
    public toggleIsPaused() {
        if (!this.synchronizedPlayer) {
            return;
        }
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.synchronizedPlayer.pause();
        } else {
            this.synchronizedPlayer.play();
        }
    }

    private onPlayerReady(event: YT.PlayerEvent) {
        assert(!!this.player);
        this.player.setVolume(this.videoSettings.volume);
        this.player.pauseVideo();
        this.initSynchronizedPlayer();
        // because onPlayerReady is no event patched by zone.js
        this.changeDetectorRef.detectChanges();
    }

    private initSynchronizedPlayer() {
        this.synchronizedPlayer?.destroy();
        this.synchronizedPlayer = new SynchronizedPlayer(
            this.synchronizedPlayerConfig ??
                new SynchronizedPlayerConfiguration(),
            // the videoDuration is sometimes NaN -> therefore this is solved via a function
            () => this.player!.getDuration() * 1000,
            (ms) => this.player!.seekTo(ms / 1000, true),
            () => this.player!.getCurrentTime() * 1000,
            () => this.player!.playVideo(),
            () => this.player!.pauseVideo(),
            this.videoSettings.videoTimeOffset
        );
        if (!this.isPaused) {
            this.synchronizedPlayer.play();
        }
    }

    private updateSize() {
        const containerWidth = this.containerRef.nativeElement.clientWidth;
        this.player?.setSize(containerWidth, containerWidth / (16 / 9));
    }

    public changeExpectedCurrentTimePercent(
        newExpectedCurrentTimePercent: number
    ) {
        if (!this.enableVideoSettingsEditing) {
            return;
        }
        // calculate the correct videoTimeOffset2
        const videoDuration = this.player!.getDuration() * 1000;
        const newExpectedCurrentTime =
            newExpectedCurrentTimePercent * videoDuration;
        const expectedCurrentTime1 = SynchronizedPlayer.getExpectedCurrentTime(
            videoDuration,
            Date.now(),
            this.videoSettings.videoTimeOffset
        );
        const videoTimeOffset1 = this.videoSettings.videoTimeOffset;
        const changedTime = expectedCurrentTime1 - newExpectedCurrentTime;
        const changedVideoTimeOffset = changedTime / videoDuration;
        const videoTimeOffset2 = this.normalizePercent(
            (videoTimeOffset1 - changedVideoTimeOffset) % 1
        );

        this.newVideoTimeOffset.emit(videoTimeOffset2);
        // TODO: add unit-test
        // expect(newExpectedCurrentTime).toBeCloseTo(
        //     SynchronizedPlayer.getExpectedCurrentTime(
        //         videoDuration,
        //         now,
        //         videoTimeOffset2
        //     ),
        //     10
        // );
    }

    private normalizePercent(value: number) {
        return value > 0 ? value : 1 + value;
    }

    enableFullscreen() {
        this.containerRef.nativeElement.requestFullscreen({
            navigationUI: 'hide',
        });
    }

    ngOnDestroy() {
        this.synchronizedPlayer?.destroy();
        this.resizeObserver?.disconnect();
        this.destroyed.next();
        this.destroyed.complete();
    }
}
