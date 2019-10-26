import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LastValuesComponent} from './last-values.component';

describe('LastValuesComponent', () => {
    let component: LastValuesComponent;
    let fixture: ComponentFixture<LastValuesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LastValuesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LastValuesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
