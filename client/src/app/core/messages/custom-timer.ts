import { ReplaySubject } from 'rxjs';

/**
 * A timer that executes the callback after the given time (in ms) is over
 * with start()/pause() the timer can be paused and continued
 * clear should be called after he is finished
 */
export class CustomTimer {
    // start is called in constructor
    private startIntervalDate!: number;
    private timeout?: NodeJS.Timeout;
    public timeUntilCallbackIfNotPaused: number;

    public isPaused = false;

    private readonly stateE$ = new ReplaySubject<'start' | 'stop'>(1);
    public readonly state$ = this.stateE$.asObservable();

    constructor(public readonly callback: () => void, public time: number) {
        this.timeUntilCallbackIfNotPaused = time;
        this.start();
    }

    public getTimeLeft() {
        if (this.isPaused) {
            return this.timeUntilCallbackIfNotPaused;
        }
        return (
            this.startIntervalDate +
            this.timeUntilCallbackIfNotPaused -
            Date.now()
        );
    }

    public pause() {
        this.timeUntilCallbackIfNotPaused = this.getTimeLeft();
        this.isPaused = true;
        this.clear();
        this.stateE$.next('stop');
    }

    public start() {
        this.isPaused = false;
        this.startIntervalDate = Date.now();
        this.timeout = setTimeout(
            this.callback,
            this.timeUntilCallbackIfNotPaused
        );
        this.stateE$.next('start');
    }

    private clear() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    }

    public destroy() {
        this.stateE$.complete();
        this.clear();
    }
}
