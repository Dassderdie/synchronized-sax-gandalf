import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlayerComponent } from './production-player.component';

describe('ProductionPlayerComponent', () => {
    let component: ProductionPlayerComponent;
    let fixture: ComponentFixture<ProductionPlayerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductionPlayerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductionPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
