import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LastReadingComponent} from './last-reading.component';

describe('LastReadingComponent', () => {
    let component: LastReadingComponent;
    let fixture: ComponentFixture<LastReadingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LastReadingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LastReadingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
