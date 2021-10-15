import type { AnimationMetadata, AnimationPlayer } from '@angular/animations';
import { animate, style, AnimationBuilder } from '@angular/animations';
import type { AfterViewInit, OnChanges } from '@angular/core';
import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

@Component({
    selector: 'app-show-more',
    templateUrl: './show-more.component.html',
    styleUrls: ['./show-more.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Automatically determents wether the content passed via ng-content is larger than the provided defaultHeight
 * and only shows a defaultHeight high part of it with the option to show all
 */
export class ShowMoreComponent implements OnChanges, AfterViewInit {
    @Input() defaultHeight!: string;

    @ViewChild('wrapper') wrapper?: ElementRef<HTMLElement>;
    private player?: AnimationPlayer;

    constructor(
        private readonly animationBuilder: AnimationBuilder,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    public fits = true;
    public showingMore = false;

    ngOnChanges() {
        this.updateState();
    }

    ngAfterViewInit() {
        // the ng-content makes up for the height of the wrapper -> wait until it is loaded
        setTimeout(() => this.updateState(), 0);
        // check every second (just for error correction)
        setInterval(() => this.updateState(), 1000);
    }

    public toggleShowMore() {
        if (!this.wrapper) {
            return;
        }
        this.showingMore = !this.showingMore;
        const currentHeight = this.wrapper.nativeElement.clientHeight;
        this.wrapper.nativeElement.style.maxHeight = '';
        if (this.showingMore) {
            // expand
            this.playAnimation([
                style({ height: currentHeight }),
                animate('0.5s ease', style({ height: '*' })),
            ]);
        } else {
            this.playAnimation([
                style({ height: '*' }),
                animate(
                    '0.5s ease',
                    style({
                        height: this.defaultHeight,
                    })
                ),
            ]);
        }
    }

    private playAnimation(animation: AnimationMetadata[]) {
        if (!this.wrapper) {
            return;
        }
        if (this.player) {
            this.player.destroy();
        }
        // play the animation
        this.player = this.animationBuilder
            .build(animation)
            .create(this.wrapper.nativeElement);
        this.player.play();
    }

    private updateState() {
        if (this.wrapper) {
            this.fits =
                !this.showingMore &&
                this.wrapper.nativeElement.scrollHeight <=
                    this.wrapper.nativeElement.clientHeight;
            this.changeDetectorRef.markForCheck();
        }
    }
}
