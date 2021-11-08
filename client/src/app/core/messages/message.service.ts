import { Injectable } from '@angular/core';
import { isEqual } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import { UUID } from 'src/app/utilities/uuid';
import { CustomTimer } from './custom-timer';
import type { MessageConfig } from './message';
import { Message } from './message';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private toastMessages: ReadonlyArray<Message> = [];
    /**
     * A list of messages that should be displayed as toast
     * old-> new
     */
    public readonly toastMessages$ = new BehaviorSubject(this.toastMessages);
    private alertMessages: ReadonlyArray<Message> = [];
    /**
     * A list of messages that should be displayed as alerts
     * new -> old
     */
    public alertMessages$ = new BehaviorSubject(this.toastMessages);
    private readonly defaultTimeout = 5 * 1000;

    /**
     * @param message the message that be posted
     * @param type
     * @param timeout After which time should the message automatically disappear? (She can always be closed manually by the user)
     * null: never
     * number: after ... ms
     * -> the highest always wins
     * @returns the message-object that got created
     */
    public postMessage(
        config: MessageConfig,
        type: 'alert' | 'toast' = 'toast',
        timeout: number | null = this.defaultTimeout
    ): Message {
        const messages = [
            ...(type === 'toast' ? this.toastMessages : this.alertMessages),
        ];
        let newestMessage: Message | undefined =
            type === 'toast' ? messages[messages.length - 1] : messages[0];
        if (!newestMessage || !isEqual(newestMessage.config, config)) {
            newestMessage = new Message(config);
            if (type === 'toast') {
                messages.push(newestMessage);
            } else {
                messages.unshift(newestMessage);
            }
        } else {
            newestMessage.amount++;
        }
        if (timeout === null) {
            newestMessage.timer?.destroy();
            newestMessage.timer = undefined;
        } else if (
            !newestMessage.timer ||
            newestMessage.timer.getTimeLeft() < timeout
        ) {
            const wasPaused = newestMessage.timer?.isPaused;
            newestMessage.timer?.destroy();
            newestMessage.timer = new CustomTimer(
                () => this.removeMessage(newestMessage!.id, type),
                timeout
            );
            if (wasPaused) {
                newestMessage.timer.pause();
            }
        }
        this.updateMessages(messages, type);
        return newestMessage;
    }

    public removeMessage(id: UUID, type: 'alert' | 'toast') {
        const messages = [
            ...(type === 'toast' ? this.toastMessages : this.alertMessages),
        ];
        const index = messages.findIndex((m) => m.id === id);
        if (index < 0) {
            errors.error({
                message: `Cannot remove message ${id} - Unknown id!`,
            });
            return;
        }
        messages.splice(index, 1);
        this.updateMessages(messages, type);
    }

    private updateMessages(
        newMessages: ReadonlyArray<Message>,
        type: 'alert' | 'toast'
    ) {
        if (type === 'alert') {
            this.alertMessages = newMessages;
            this.alertMessages$.next(newMessages);
        }
        if (type === 'toast') {
            this.toastMessages = newMessages;
            this.toastMessages$.next(newMessages);
        }
    }
}
