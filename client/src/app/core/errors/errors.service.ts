/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { MessageConfig } from '../messages/message';
import { MessageService } from '../messages/message.service';
import type { CustomError } from './errors-manager';

@Injectable({ providedIn: 'root' })
export class ErrorsService {
    constructor(private readonly messageService: MessageService) {}

    /**
     * Because the original console is intercepted, to display the errors appropiatly we
     */
    private originalConsole = {
        warn: console.warn,
        error: console.error,
        log: console.log,
        info: console.info,
    };

    private interceptConsole(key: 'error' | 'info' | 'log' | 'warn') {
        const original = console[key].bind(console);
        this.originalConsole[key] = original;
        console[key] = (...args: any) => {
            original(...args);
            // ResponseHasBeenChangedAfterItHasbeenChecked
            if (args?.[0] === 'ERROR' && args?.[1]?.code === '100') {
                return;
            }
            let color: MessageConfig['color'] | undefined;
            switch (key) {
                case 'error':
                    color = 'danger';
                    break;
                case 'warn':
                    color = 'warning';
                    break;
                case 'log':
                case 'info':
                    color = 'info';
                    break;
            }
            this.messageService.postMessage(
                {
                    color,
                    title: 'Development error:',
                    log: args,
                },
                'toast',
                5000
            );
        };
    }

    private logToConsole(
        key: 'error' | 'info' | 'log' | 'warn',
        customError: CustomError
    ) {
        this.originalConsole[key](
            customError.message,
            customError.error,
            customError.logValues
        );
    }

    /**
     * Provides visuell feedback about a server error to the user
     * and logs the error to the console if the devMode is enabled
     * @param error Error
     */
    private displayCustomError(customError: CustomError) {
        let log: any;
        if (customError.error.name || customError.error.message) {
            log = {
                name: customError.error.name,
                message: customError.error.message,
                stack: customError.error.stack,
            };
        } else {
            log = { error: customError.error };
        }
        log.log = customError.logValues;
        this.messageService.postMessage(
            {
                color: customError.status === 'error' ? 'danger' : 'warning',
                title: 'An error occured',
                log,
            },
            'toast',
            null
        );
    }

    /**
     * this has to be called at the start of the application in a component/service, to make angular actually include this service
     */
    public initialize() {
        // intercept the console statements and display them to make it easier to catch them
        for (const consoleType of interceptedConsoleTypes) {
            this.interceptConsole(consoleType);
        }
        errors.errors$.subscribe((customError) => {
            switch (customError.status) {
                case 'error':
                    this.displayCustomError(customError);
                // eslint-disable-next-line no-fallthrough
                case 'logError':
                    this.logToConsole('error', customError);
                    break;
                case 'warning':
                    this.displayCustomError(customError);
                // eslint-disable-next-line no-fallthrough
                case 'logWarning':
                    this.logToConsole('warn', customError);
                    break;
                default:
                    break;
            }
        });
    }
}

const interceptedConsoleTypes = ['error', 'info', 'log', 'warn'] as const;
