import { interval, ReplaySubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SyncDifferenceEstimator } from './sync-difference-estimator';

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
    private syncDifferenceEstimator = new SyncDifferenceEstimator();
    private synchronisationTime = 50;

    constructor(
        public synchronisationOffset: number,
        private readonly getDuration: () => number,
        private readonly seekTo: (ms: number) => void,
        private readonly getCurrentTime: () => number,
        private readonly playVideo: () => void,
        private readonly pauseVideo: () => void
    ) {
        this.playSynchronized();
        interval(500)
            .pipe(
                takeUntil(this.destroyed),
                filter(() => !this.synchronisationTimeout)
            )
            .subscribe(() => {
                const expectedTime = this.getExpectedCurrentTime();
                const currentTime = this.getCurrentTime();
                const deviation = expectedTime - currentTime;
                if (Math.abs(deviation) > MAXIMUM_DEVIATION) {
                    // the video is probably stuck/buffering
                    console.log('stuck');
                    this.playSynchronized();
                } else {
                    this.syncDifferenceEstimator.addDeviation(deviation);
                    if (
                        this.syncDifferenceEstimator.estimatedSyncTimeDifference
                    ) {
                        this.synchronisationTime +=
                            this.syncDifferenceEstimator.estimatedSyncTimeDifference;
                        this.playSynchronized();
                        this.syncDifferenceEstimator.synchronizing();
                    }
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
        this.pauseVideo();
        this.seekTo(
            (this.getExpectedCurrentTime() + PRELOAD_TIME) % this.getDuration()
        );
        this.pauseVideo();
        this.state$.next('synchronizing');
        this.synchronisationTimeout = setTimeout(() => {
            this.playVideo();
            this.state$.next('playing');

            this.clearSynchronisationTimeout();
        }, PRELOAD_TIME - this.synchronisationTime);
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
const MAXIMUM_DEVIATION = 3000;

export type SynchronizedPlayerState = 'synchronizing' | 'paused' | 'playing';
