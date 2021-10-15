import { fakeAsync, tick } from '@angular/core/testing';
import { CustomTimer } from './custom-timer';

describe('CustomTimer', () => {
    let timer!: CustomTimer;

    afterEach(() => {
        timer.destroy();
    });

    it('should be created', () => {
        timer = new CustomTimer(() => 1, 1000);
        expect(timer).toBeTruthy();
    });

    it('should call the callback after the time is over', fakeAsync(() => {
        let flag = false;
        const time = 1000;
        timer = new CustomTimer(() => (flag = true), time);
        expect(flag).toBe(false);
        tick(time / 2);
        expect(flag).toBe(false);
        tick(time + 20);
        expect(flag).toBe(true);
    }));

    it('should correctly return the timeLeft', fakeAsync(() => {
        const precision = 100;
        const time = 5000;
        timer = new CustomTimer(() => {
            expect(timer.getTimeLeft()).toBeCloseTo(0, precision);
        }, time);
        expect(timer.getTimeLeft()).toBeCloseTo(time, precision);
        timer.pause();
        // paused
        expect(timer.getTimeLeft()).toBeCloseTo(time, precision);
        tick(2000);
        expect(timer.getTimeLeft()).toBeCloseTo(time, precision);
        timer.start();
        // started
        expect(timer.getTimeLeft()).toBeCloseTo(time, precision);
        tick(time / 2);
        timer.pause();
        // paused
        expect(timer.getTimeLeft()).toBeCloseTo(time / 2, precision);
        tick(2000);
        expect(timer.getTimeLeft()).toBeCloseTo(time / 2, precision);
        timer.start();
        // started
        tick(time / 2 + precision);
    }));
});
