import { EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { VideoSettings } from 'src/app/core/video-settings';
import { SynchronizedPlayerConfiguration } from '../synchronized-player-configuration';

@Component({
    selector: 'app-production-player',
    templateUrl: './production-player.component.html',
    styleUrls: ['./production-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionPlayerComponent {
    @Input() systemTimeOffset!: number;
    @Input() videoSettings!: VideoSettings;
    @Output() newVideoTimeOffset = new EventEmitter<number>();

    public isPaused = true;
    public isFullscreen$ = new Subject();
    public config = new SynchronizedPlayerConfiguration();

    ngOnChanges(changes: SimpleChanges) {
        if (changes.systemTimeOffset) {
            this.config = {
                ...this.config,
                synchronisationOffset: this.systemTimeOffset,
            };
        }
    }
}
