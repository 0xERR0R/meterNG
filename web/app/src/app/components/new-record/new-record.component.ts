import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MeterService} from "../../services/meter.service";
import {Meter} from "../../model/meter";
import {Reading, ReadingType} from "../../model/reading";
import {Router} from "@angular/router";
import {TranslatedNotificationService} from "../../services/translated-notification.service";

const METER_PREFIX = "meter.";

@Component({
    selector: 'app-new-record',
    templateUrl: './new-record.component.html',
    styleUrls: ['./new-record.component.css']
})
export class NewRecordComponent implements OnInit {
    readonly METER_PREFIX = METER_PREFIX;
    meters: Meter[]
    date: Date = new Date()

    recordFormGroup: FormGroup;

    constructor(private meterService: MeterService,
                private formBuilder: FormBuilder,
                private notificationService: TranslatedNotificationService,
                private router: Router) {
    }

    ngOnInit() {
        this.meterService.getMeters() //
            .subscribe(meters => {
                this.meters = meters;

                // create number filed for each meter
                let controlConfig: { [p: string]: any } = {
                    readingDate: ['', [Validators.required]]
                }
                meters.forEach(m => controlConfig[METER_PREFIX + m.name] = ['', [Validators.min(0)]])

                this.recordFormGroup = this.formBuilder.group(controlConfig);
            })
    }

    allMeterValuesEmpty(): boolean {
        return this.getMeterValuesAsMap().size == 0;
    }

    getMeterValuesAsMap(): Map<string, number> {
        let result = new Map();
        let val = this.recordFormGroup.value;
        Object.keys(val).forEach(key => {
            if (key.startsWith(METER_PREFIX) && val[key] && val[key] !== "") {
                result.set(key.substring(METER_PREFIX.length), val[key]);
            }
        });
        return result;
    }


    onSubmit() {
        let date = this.recordFormGroup.value['readingDate'];

        let readings: Reading[] = []
        this.getMeterValuesAsMap().forEach((value, key) => {
            let reading: Reading = {date: new Date(date), meterId: key, value: value, type: ReadingType.MEASURE};
            readings.push(reading);
        });

        this.meterService.storeReadings(readings) //
            .subscribe(res => {
                    this.notificationService.info("newRecordComponent.readingStored.title", "newRecordComponent.readingStored.text")
                    this.router.navigateByUrl("/")
                }
            ) //
    }
}
