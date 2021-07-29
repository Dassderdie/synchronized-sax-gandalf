import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-production-player',
    templateUrl: './production-player.component.html',
    styleUrls: ['./production-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionPlayerComponent {
    constructor() {}
    public videoId = 'BBGEG21CGo0';
    public isPaused = true;
    public fullscreen$ = new Subject();
}
