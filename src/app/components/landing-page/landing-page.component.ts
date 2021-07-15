import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
    public readonly demoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        `${location.href}youtube-player`
    );

    constructor(private readonly domSanitizer: DomSanitizer) {}

    ngOnInit(): void {}
}
