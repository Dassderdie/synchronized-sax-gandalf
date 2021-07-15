import { interval, ReplaySubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/**
 * All time-values are in ms
 */
export class SynchronizedPlayer {
    private readonly destroyed = new Subject();

    private isPaused = false;
    public readonly state$ = new ReplaySubject<SynchronizedPlayerState>(1);
    /**
     * The current deviation from the "base" timeline
     */
    public readonly deviation$ = new ReplaySubject<number>(1);

    constructor(
        private readonly synchronisationOffset: number,
        private readonly getDuration: () => number,
        // This is in seconds
        private readonly seekTo: (seconds: number) => void,
        private readonly getCurrentTime: () => number,
        private readonly playVideo: () => void,
        private readonly pauseVideo: () => void
    ) {
        this.playSynchronized();
        interval(1000)
            .pipe(
                takeUntil(this.destroyed),
                filter(() => !this.synchronisationTimeout)
            )
            .subscribe(() => {
                const deviation = Math.abs(
                    this.getExpectedCurrentTime() - this.getCurrentTime()
                );
                if (deviation > MAXIMUM_DEVIATION) {
                    this.playSynchronized();
                }
                this.deviation$.next(Math.round(deviation));
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
        this.pauseVideo();
        this.seekTo(seekToSeconds);
        this.pauseVideo();
        this.state$.next('synchronizing');
        this.synchronisationTimeout = setTimeout(() => {
            this.playVideo();
            this.state$.next('playing');

            this.clearSynchronisationTimeout();
            // 50 seems to be the average time to get the player to play
            // this does not reduce the synchronisation difference, but helps to make the Average deviation more accurate
        }, PRELOAD_TIME - 50);
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
const MAXIMUM_DEVIATION = 50;

export type SynchronizedPlayerState = 'synchronizing' | 'paused' | 'playing';
