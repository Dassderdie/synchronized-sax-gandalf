import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

/**
 * All time-values are in ms
 */
export class SynchronizedPlayer {
    private readonly destroyed = new Subject();

    private isPaused = false;

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
        // this.playSynchronized();
        currentTime$
            .pipe(takeUntil(this.destroyed), debounceTime(1000))
            .subscribe((currentTime) => {
                const deviation = Math.abs(
                    this.getExpectedCurrentTime() - currentTime
                );
                if (deviation > MAXIMUM_DEVIATION) {
                    this.playSynchronized();
                }
            });
    }

    private synchronisationTimeout?: ReturnType<typeof setTimeout>;
    public playSynchronized() {
        if (this.synchronisationTimeout) {
            clearTimeout(this.synchronisationTimeout);
        }
        if (this.isPaused) {
            return;
        }
        this.pauseVideo();
        const seekToSeconds = Math.max(
            Math.round(
                ((this.getExpectedCurrentTime() + PRELOAD_TIME) %
                    this.getDuration()) /
                    1000
            ),
            1
        );
        this.seekTo(seekToSeconds);
        this.pauseVideo();

        this.synchronisationTimeout = setTimeout(() => {
            this.playVideo();
        }, this.getTimeUntilSeekIsValid(seekToSeconds * 1000));
    }

    public play() {
        this.isPaused = false;
        this.playSynchronized();
    }

    public pause() {
        this.isPaused = true;
        if (this.synchronisationTimeout) {
            clearTimeout(this.synchronisationTimeout);
        }
        this.pauseVideo();
    }

    private getExpectedCurrentTime() {
        return (Date.now() + this.synchronisationOffset) % this.getDuration();
    }

    private getTimeUntilSeekIsValid(seekToPart: number) {
        const videoDuration = this.getDuration();
        return Math.abs(
            (seekToPart -
                ((Date.now() + this.synchronisationOffset) % videoDuration)) %
                videoDuration
        );
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
