import { interval, ReplaySubject, Subject } from 'rxjs';
import { filter, skip, takeUntil } from 'rxjs/operators';

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
    private synchronisationTime = 50;

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
        let estimatedSynchronisationTimeDifference = this.synchronisationTime;
        interval(1000)
            .pipe(
                takeUntil(this.destroyed),
                filter(() => !this.synchronisationTimeout),
                skip(1)
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
                    this.lastDeviations.shift();
                    this.lastDeviations.push(deviation);
                    const median = (array: number[]) =>
                        [...array].sort()[Math.floor(array.length / 2)];
                    // wait until all are loaded
                    if (
                        this.lastDeviations.every(
                            (lastDeviation) => typeof lastDeviation === 'number'
                        )
                    ) {
                        estimatedSynchronisationTimeDifference = median(
                            // ignore the first 3 elements because they have (likely) are likely inaccurate because of the synchronisation
                            (this.lastDeviations as number[]).slice(3, -1)
                        );
                        if (
                            Math.abs(estimatedSynchronisationTimeDifference) >
                            20
                        ) {
                            console.log(
                                this.lastDeviations,
                                estimatedSynchronisationTimeDifference,
                                this.synchronisationTime
                            );
                            this.synchronisationTime +=
                                estimatedSynchronisationTimeDifference;

                            this.playSynchronized();
                        }
                    }
                }
                this.deviation$.next(Math.round(deviation));
            });
    }

    private lastDeviations: (number | null)[] = new Array(15).fill(null);

    private synchronisationTimeout?: ReturnType<typeof setTimeout>;
    public playSynchronized() {
        this.clearSynchronisationTimeout();
        if (this.isPaused) {
            return;
        }
        this.lastDeviations = new Array(15).fill(null);
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
const MAXIMUM_DEVIATION = 1000;

export type SynchronizedPlayerState = 'synchronizing' | 'paused' | 'playing';
