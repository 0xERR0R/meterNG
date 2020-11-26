import {Component, OnInit} from '@angular/core';
import {MeterService} from '../../services/meter.service';
import {Reading, ReadingType} from '../../model/reading';
import {Meter} from '../../model/meter';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ReadingDeleteConfirmationComponent} from '../reading-delete-confirmation/reading-delete-confirmation.component';
import {TranslatedNotificationService} from '../../services/translated-notification.service';
import {
    faTrash
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-readings',
    templateUrl: './readings.component.html',
    styleUrls: ['./readings.component.css']
})
export class ReadingsComponent implements OnInit {
    faTrash = faTrash
    readings: Reading[];
    filterMeterId: string;
    filterYearFrom: number;
    filterYearUntil: number;
    filterYears: number[] = [];

    meters: Meter[];

    modalRef: BsModalRef;

    public OFFSET = ReadingType.OFFSET;

    constructor(private meterService: MeterService,
                private modalService: BsModalService,
                private notificationService: TranslatedNotificationService) {
    }

    openConfirmDialog(reading: Reading) {
        this.modalRef = this.modalService.show(ReadingDeleteConfirmationComponent, {initialState: {reading}});
        this.modalRef.content.onClose.subscribe(result => {
            if (result) {
                this.meterService.deleteReading(reading.id).subscribe(res => {
                    this.notificationService.info('readingsComponent.readingDeleted.title', 'readingsComponent.readingDeleted.text');
                    this.loadReadings();
                });
            }
        });
    }

    ngOnInit() {
        this.loadReadings();

        this.meterService.getMeters().subscribe((meters => this.meters = meters));
    }

    loadReadings() {
        this.meterService.getReadings().subscribe(readings => {
            this.readings = readings.sort((a: Reading, b: Reading) => a.date > b.date ? -1 : 1);
            if (readings.length > 0) {
                const smallestYear = readings.reduce((min, p) => p.date.getFullYear() < min ? p.date.getFullYear() : min, readings[0].date.getFullYear());
                const greatestYear = readings.reduce((max, p) => p.date.getFullYear() > max ? p.date.getFullYear() : max, readings[0].date.getFullYear());
                for (let i = smallestYear; i <= greatestYear; i++) {
                    this.filterYears.push(i);
                }
            }

        });
    }

    filter(readings: Reading[]): Reading[] {

        return readings.filter(r => {
            return (this.filterMeterId ? r.meterId === this.filterMeterId : true) &&
                (this.filterYearFrom ? r.date.getFullYear() >= this.filterYearFrom : true) &&
                (this.filterYearUntil ? r.date.getFullYear() <= this.filterYearUntil : true);
        });
    }
}
