import {Component, OnInit} from '@angular/core';
import {MeterService} from "../../../services/meter.service";

@Component({
    selector: 'app-last-reading',
    templateUrl: './last-reading.component.html',
    styleUrls: ['./last-reading.component.css']
})
export class LastReadingComponent implements OnInit {
    lastReadingDate: Date;
    daysSince: number

    constructor(private meterService: MeterService) {
    }

    ngOnInit() {
        this.meterService.getLastReadingDate().subscribe(res => {
            this.lastReadingDate = res
            this.daysSince = new Date(Date.now()).getDate() - this.lastReadingDate.getDate()
        })

    }

}
