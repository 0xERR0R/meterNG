import {Component, OnInit} from '@angular/core';
import {Meter} from "../../model/meter";
import {MeterService} from "../../services/meter.service";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    meters: Meter[];

    constructor(private meterService: MeterService) {
    }

    ngOnInit() {
        this.meterService.getMeters().subscribe(res => this.meters = res);
    }

}
