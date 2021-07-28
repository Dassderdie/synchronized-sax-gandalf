import { interval, ReplaySubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SynchronizedPlayerConfiguration } from './synchronized-player-configuration';
import { SyncDifferenceEstimator } from './sync-difference-estimator';

/**
 * All time-values are in ms
 */
export class SynchronizedPlayer {
    private readonly destroyed = new Subject();

    private isPaused = true;
    public readonly state$ = new ReplaySubject<SynchronizedPlayerState>(1);
    /**
     * The current deviation from the "base" timeline
     */
    public readonly deviation$ = new ReplaySubject<number>(1);
    private syncDifferenceEstimator: SyncDifferenceEstimator;
    private synchronisationTime = this.config.synchronisationStartTime;

    constructor(
        private config: SynchronizedPlayerConfiguration,
        private readonly getDuration: () => number,
        private readonly seekTo: (ms: number) => void,
        private readonly getCurrentTime: () => number,
        private readonly playVideo: () => void,
        private readonly pauseVideo: () => void
    ) {
        this.syncDifferenceEstimator = new SyncDifferenceEstimator(
            config.stuckDeviation,
            config.syncPrecision
        );
        this.syncDifferenceEstimator.stuck$
            .pipe(
                filter(() => !this.isPaused),
                takeUntil(this.destroyed)
            )
            .subscribe(() => {
                this.playSynchronized();
                this.syncDifferenceEstimator.synchronizing();
            });
        interval(500)
            .pipe(
                takeUntil(this.destroyed),
                filter(() => !this.synchronisationTimeout && !this.isPaused)
            )
            .subscribe(() => {
                const expectedTime = this.getExpectedCurrentTime();
                const currentTime = this.getCurrentTime();
                const deviation = expectedTime - currentTime;
                this.syncDifferenceEstimator.addDeviation(deviation);
                if (this.syncDifferenceEstimator.estimatedSyncTimeDifference) {
                    this.synchronisationTime +=
                        this.syncDifferenceEstimator.estimatedSyncTimeDifference;
                    this.playSynchronized();
                    this.syncDifferenceEstimator.synchronizing();
                }
                this.deviation$.next(Math.round(deviation));
            });
    }

    private synchronisationTimeout?: ReturnType<typeof setTimeout>;
    private playSynchronized() {
        this.clearSynchronisationTimeout();
        if (this.isPaused) {
            return;
        }
        this.pauseVideo();
        this.seekTo(
            (this.getExpectedCurrentTime() + this.config.preloadTime) %
                this.getDuration()
        );
        this.pauseVideo();
        this.state$.next('synchronizing');
        this.synchronisationTimeout = setTimeout(() => {
            this.playVideo();
            this.state$.next('playing');

            this.clearSynchronisationTimeout();
        }, this.config.preloadTime - this.synchronisationTime);
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
        return (
            (Date.now() + this.config.synchronisationOffset) %
            this.getDuration()
        );
    }

    public destroy() {
        this.destroyed.next();
    }
}

export type SynchronizedPlayerState = 'synchronizing' | 'paused' | 'playing';
