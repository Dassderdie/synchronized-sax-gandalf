import { Subject } from 'rxjs';

/**
 * This class is a singleton.
 * It is used for simple custom error handling
 */
export class ErrorsManager {
    private readonly errorsE$ = new Subject<CustomError>();
    public errors$ = this.errorsE$.asObservable();

    /**
     * If the assertion evaluates to false an Error or warning is logged, displayed or an error is thrown
     */
    public assert(
        assertion: boolean,
        options?: {
            status: 'error' | 'logError' | 'logWarning' | 'throw' | 'warning';
            message?: string;
            logValues?: any;
        }
    ): asserts assertion {
        if (assertion) {
            return;
        }
        this.error({ error: Error('Assertion failed!'), ...options });
    }

    public error(options?: {
        error?: Error;
        status?: 'error' | 'logError' | 'logWarning' | 'throw' | 'warning';
        message?: string;
        logValues?: any;
    }) {
        const defaultOptions = {
            error: Error('Something went wrong…'),
            status: 'error',
        };
        const customError = {
            ...defaultOptions,
            ...options,
        };
        if (customError.status === 'throw') {
            this.errorsE$.next({ ...customError, status: 'error' });
            throw Error('Assertion failed');
        } else {
            this.errorsE$.next(customError as CustomError);
        }
    }
}

export interface CustomError {
    status: 'error' | 'logError' | 'logWarning' | 'warning';
    error: Error;
    message?: string;
    logValues?: any;
}
