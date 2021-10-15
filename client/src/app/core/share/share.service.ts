import { Injectable } from '@angular/core';
import { copyToClipboard } from 'src/app/utilities/copy-to-clipboard';
import { MessageService } from '../messages/message.service';

@Injectable({
    providedIn: 'root',
})
export class ShareService {
    constructor(private readonly messageService: MessageService) {}

    public readonly supportsNativeShare = !!navigator.share;

    /**
     * Enables the user to share the url via the Web Share API (if available)
     * Defaults to the current url
     */
    public shareUrl(
        shareData?: {
            title?: string;
            text?: string;
        },
        url = location.href
    ) {
        if (navigator.share) {
            navigator.share({ ...shareData, url }).catch((error) => {
                if (error.name === 'AbortError') {
                    return;
                }
                errors.error({ error, status: 'error' });
            });
        } else {
            copyToClipboard(url);
            this.messageService.postMessage(
                {
                    color: 'info',
                    title: 'Link copied',
                    body: '',
                },
                'toast',
                3 * 1000
            );
        }
    }

    public shareFiles(data: {
        files: ReadonlyArray<File>;
        title?: string;
        text?: string;
    }) {
        if ((navigator as any).canShare?.({ files: data.files })) {
            navigator.share(data as any).catch((error) => {
                if (error.name === 'AbortError') {
                    return;
                }
                errors.error({ error, status: 'error' });
            });
        } else {
            errors.error({
                message: `Your browser doesn't support file sharing.`,
                status: 'warning',
            });
        }
    }
}
