import {Component, OnInit} from '@angular/core';
import {MeterService} from "../../../services/meter.service";

@Component({
    selector: 'app-last-reading',
    templateUrl: './last-reading.component.html',
    styleUrls: ['./last-reading.component.css']
})
export class LastReadingComponent implements OnInit {
    lastReadingDate: Date;
    daysSince: number;

    constructor(private meterService: MeterService) {
    }

    ngOnInit() {
        this.meterService.getLastReadingDate().subscribe(res => {
            this.lastReadingDate = res;

            const diff = new Date(Date.now()).getTime() - this.lastReadingDate.getTime();
            this.daysSince = Math.ceil(diff  / (1000 * 60 * 60 * 24));
        })

    }

}
