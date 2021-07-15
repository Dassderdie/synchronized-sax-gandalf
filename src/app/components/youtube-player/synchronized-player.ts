import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, takeUntil, throttleTime } from 'rxjs/operators';

/**
 * All time-values are in ms
 */
export class SynchronizedPlayer {
    private readonly destroyed = new Subject();

    private isPaused = false;
    public readonly state$ = new ReplaySubject<SynchronizedPlayerState>(1);

    constructor(
        private readonly synchronisationOffset: number,
        private readonly getDuration: () => number,
        // This is in seconds
        private readonly seekTo: (seconds: number) => void,
        /**
         * Emits the current time of the video in ms in arbitrary intervalls
         * TODO: these times must be 100ms exact
         */
        currentTime$: Observable<number>,
        private readonly playVideo: () => void,
        private readonly pauseVideo: () => void
    ) {
        this.playSynchronized();
        currentTime$
            .pipe(
                takeUntil(this.destroyed),
                throttleTime(1000),
                filter(() => !this.synchronisationTimeout)
            )
            .subscribe((currentTime) => {
                const deviation = Math.abs(
                    this.getExpectedCurrentTime() - currentTime
                );
                console.log('check deviation:', deviation);
                if (deviation > MAXIMUM_DEVIATION) {
                    this.playSynchronized();
                }
            });
    }

    private synchronisationTimeout?: ReturnType<typeof setTimeout>;
    public playSynchronized() {
        this.clearSynchronisationTimeout();
        if (this.isPaused) {
            return;
        }
        const seekToSeconds =
            ((this.getExpectedCurrentTime() + PRELOAD_TIME) %
                this.getDuration()) /
            1000;
        console.log('seekToSeconds', seekToSeconds);

        this.pauseVideo();
        this.seekTo(seekToSeconds);
        this.pauseVideo();
        this.state$.next('synchronizing');
        this.synchronisationTimeout = setTimeout(() => {
            this.playVideo();
            this.state$.next('playing');

            this.clearSynchronisationTimeout();
        }, PRELOAD_TIME);
    }

    private clearSynchronisationTimeout() {
        if (this.synchronisationTimeout) {
            clearTimeout(this.synchronisationTimeout);
        }
        this.synchronisationTimeout = undefined;
    }

    public play() {
        this.isPaused = false;
        this.playSynchronized();
    }

    public pause() {
        this.isPaused = true;
        this.clearSynchronisationTimeout();
        this.pauseVideo();
        this.state$.next('paused');
    }

    private getExpectedCurrentTime() {
        return (Date.now() + this.synchronisationOffset) % this.getDuration();
    }

    public destroy() {
        this.destroyed.next();
    }
}

/**
 * The time yt needs (approximately) to buffer the videostream so that it doesn't stop after playing
 * TODO: check with player.getVideoLoadedFraction
 */
const PRELOAD_TIME = 3000;
const MAXIMUM_DEVIATION = 100;

export type SynchronizedPlayerState = 'synchronizing' | 'paused' | 'playing';
