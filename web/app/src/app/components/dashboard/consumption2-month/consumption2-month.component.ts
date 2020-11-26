import {Component, OnInit} from '@angular/core';
import {
    faChartLine
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-consumption2-month',
    templateUrl: './consumption2-month.component.html',
    styleUrls: ['./consumption2-month.component.css']
})
export class Consumption2MonthComponent implements OnInit {
    faChartLine = faChartLine;

    constructor() {
    }

    ngOnInit() {
    }

}
