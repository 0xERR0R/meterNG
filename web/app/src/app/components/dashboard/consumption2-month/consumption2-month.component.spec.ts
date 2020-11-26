import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {Consumption2MonthComponent} from './consumption2-month.component';

describe('Consumption2MonthComponent', () => {
    let component: Consumption2MonthComponent;
    let fixture: ComponentFixture<Consumption2MonthComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [Consumption2MonthComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Consumption2MonthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
