/**
 * All time-values are in ms
 */
export class SynchronizedPlayer {
    constructor(
        private synchronisationOffset: number,
        private getDuration: () => number,
        // This is in seconds
        private seekTo: (seconds: number) => void,
        private getCurrentTime: () => number,
        private play: () => void,
        private pause: () => void
    ) {
        this.playSynchronized();
    }

    private playSynchronized() {
        this.pause();
        const seekToSeconds = Math.max(
            Math.round(
                ((this.getExpectedCurrentTime() + PRELOAD_TIME) %
                    this.getDuration()) /
                    1000
            ),
            1
        );
        this.seekTo(seekToSeconds);
        this.pause();

        console.log(this.getTimeUntilSeekIsValid(seekToSeconds * 1000));
        setTimeout(() => {
            this.play();
            console.log(
                Math.abs(this.getCurrentTime() - this.getExpectedCurrentTime())
            );

            // if (
            //     Math.abs(
            //         this.player.getCurrentTime() * 1000 -
            //             this.getExpectedCurrentTime()
            //     ) > MAXIMUM_Deviation
            // ) {
            //     this.playVideoSynchronized();
            // } else {
            //     this.player!.playVideo();
            // }
        }, this.getTimeUntilSeekIsValid(seekToSeconds * 1000));
    }

    private getExpectedCurrentTime() {
        return (Date.now() + this.synchronisationOffset) % this.getDuration();
    }

    private getTimeUntilSeekIsValid(seekToPart: number) {
        const videoDuration = this.getDuration();
        return (
            (seekToPart -
                ((Date.now() + this.synchronisationOffset) % videoDuration)) %
            videoDuration
        );
    }

    public destroy() {}
}

/**
 * The time yt needs (approximately) to buffer the videostream so that it doesn't stop after playing
 * TODO: check with player.getVideoLoadedFraction
 */
const PRELOAD_TIME = 7000;
const MAXIMUM_DEVIATION = 100;
