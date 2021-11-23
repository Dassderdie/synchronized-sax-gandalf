import {
    AfterViewInit,
    ChangeDetectorRef,
    ElementRef,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { Input } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class YoutubePlayerComponent
    implements AfterViewInit, OnInit, OnChanges
{
    @Input() videoSettings!: VideoSettings;
    @Input() synchronizedPlayerConfig?: SynchronizedPlayerConfiguration;
    @Input() isPaused = true;
    @Input() isFullscreen$?: Observable<unknown>;

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

    ngOnInit() {
        this.isFullscreen$?.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.containerRef.nativeElement.requestFullscreen({
                navigationUI: 'hide',
            });
        });
    }

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
        if (changes.synchronizedPlayerConfig && this.player) {
            this.initSynchronizedPlayer();
        }
        if (changes.isPaused && this.synchronizedPlayer) {
            if (this.isPaused) {
                this.synchronizedPlayer.pause();
            } else {
                this.synchronizedPlayer.play();
            }
        }
        if (changes.fullscreen$) {
            assert(changes.fullscreen$.isFirstChange());
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
        if (!this.isPaused) {
            this.synchronizedPlayer.play();
        }
    }

    private updateSize() {
        const containerWidth = this.containerRef.nativeElement.clientWidth;
        this.player?.setSize(containerWidth, containerWidth / (16 / 9));
    }

    ngOnDestroy() {
        this.synchronizedPlayer?.destroy();
        this.resizeObserver?.disconnect();
        this.destroyed.next();
        this.destroyed.complete();
    }
}
