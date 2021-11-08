import type { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * a utility class or interface that should be used in components
 * usage:
 * `observable.pipe(takeUntil(this.destroyed))`
 * to prevent memory-leaks from subscriptions
 *
 * -> Do not inject it anywhere
 */
// workaround to prevent error from angular because a hook (OnDestroy) is used and no decorator present
@Injectable()
export abstract class Destroyed implements OnDestroy {
    /**
     * emits when the component gets destroyed
     */
    readonly destroyed = new Subject<unknown>();

    /**
     * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
     * Use for any custom cleanup that needs to occur when the instance is destroyed.
     *
     * This method should have the following call (because inherited lifecycle-functions are not called by angular):
     * ```ts
     * ngOnDestroy(){
     *    destroyed.next(undefined);
     * }
     * ```
     */
    abstract ngOnDestroy(): void;
}
