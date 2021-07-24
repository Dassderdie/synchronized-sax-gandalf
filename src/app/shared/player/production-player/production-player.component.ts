import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-production-player',
    templateUrl: './production-player.component.html',
    styleUrls: ['./production-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionPlayerComponent {
    constructor() {}
    public videoId = 'BBGEG21CGo0';
}
