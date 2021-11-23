import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import { VideoSettings } from 'src/app/core/video-settings';

@Component({
    selector: 'app-video-settings-form',
    templateUrl: './video-settings-form.component.html',
    styleUrls: ['./video-settings-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoSettingsFormComponent {
    @Input() videoSettings!: VideoSettings;
    @Output() videoSettingsChange = new EventEmitter<VideoSettings>();

    constructor() {}

    public readonly recommendedVideoIds = VideoSettings.recommendedVideoIds;

    public setVideoSettings(videoSettings: Partial<VideoSettings>) {
        this.videoSettingsChange.emit({
            ...this.videoSettings,
            ...videoSettings,
        });
    }
}
