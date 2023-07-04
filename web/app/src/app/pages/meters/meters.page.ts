import { Component, OnInit } from '@angular/core';
import { Meter } from 'src/app/models/meter';
import { MeterService } from 'src/app/services/meter.service';

@Component({
  selector: 'app-meters',
  templateUrl: './meters.page.html',
  styleUrls: ['./meters.page.scss'],
})
export class MetersPage implements OnInit {
  meters: Meter[] = []

  constructor(private meterService: MeterService) { }

  ngOnInit() {
    this.meterService.getMeters().subscribe(res => this.meters = res)
  }

}
