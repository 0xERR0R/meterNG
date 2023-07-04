import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ReadingsService} from '../../services/readings.service';
import {GuiService} from "../../services/gui.service";

@Component({
  selector: 'app-years-filter',
  templateUrl: './years-filter.component.html',
  styleUrls: ['./years-filter.component.scss'],
})
export class YearsFilterComponent implements OnInit {

  @Output()
  yearsChangedEvent = new EventEmitter<string[]>();

  yearsFromReadings: string[] = [];
  selectedYears: string[] = [];

  constructor(private readingsService: ReadingsService, private gui: GuiService) {
  }

  ngOnInit() {
    this.gui.wrapLoading(this.readingsService.getReadingsYears()).subscribe(res => {
      this.yearsFromReadings = res;
      this.selectedYears = res.slice(0, res.length > 3 ? 3 : res.length)
      this.onFilterChanged()
    })
  }

  onFilterChanged() {
    this.yearsChangedEvent.emit(this.selectedYears);
  }
}
