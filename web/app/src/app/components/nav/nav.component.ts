import {Component, OnInit} from '@angular/core';
import {NavService} from '../../services/nav.service';
import {
    faChartLine,
    faListAlt,
    faPencilAlt,
    faTable,
    faTrash,
    faWrench
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    faChartLine = faChartLine;
    faWrench = faWrench;
    faPencilAlt = faPencilAlt;
    faTable = faTable;
    faTrash = faTrash;
    faListAlt = faListAlt;
    label: String;

    constructor(private navService: NavService) {
    }

    ngOnInit() {
        this.navService.getLabel().subscribe(label => this.label = !label || 0 === label.length ? '' : '(' + label + ')');
    }

}
