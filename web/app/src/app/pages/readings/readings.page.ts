import {Component, OnInit} from '@angular/core';
import {Reading} from 'src/app/models/reading';
import {ReadingsService} from 'src/app/services/readings.service';
import {AlertController, ToastController, ViewDidEnter} from '@ionic/angular';
import {MeterService} from 'src/app/services/meter.service';
import {Meter} from 'src/app/models/meter';
import {GuiService} from "../../services/gui.service";

@Component({
  selector: 'app-readings',
  templateUrl: './readings.page.html',
  styleUrls: ['./readings.page.scss'],
})
export class ReadingsPage implements OnInit, ViewDidEnter {
  readings: Reading[] = [];

  meters: Map<string, Meter> = new Map<string, Meter>();

  searchYears: string[] = [];
  searchMeters: string[] = [];

  constructor(private readingsService: ReadingsService,
              private meterService: MeterService,
              private toastController: ToastController,
              private alertController: AlertController,
              private gui: GuiService) {
  }


  ngOnInit() {
    this.gui.wrapLoading(this.meterService.getMeters()).subscribe(res => {
      res.forEach(meter => this.meters.set(meter.name, meter))
    });
  }

  ionViewDidEnter(): void {
    // this.loadReadings()
  }

  loadReadings() {
    this.gui.wrapLoading(this.readingsService.getReadings(this.searchMeters, this.searchYears)).subscribe(res => this.readings = res);
  }

  async deleteReading(id: number) {
    const alert = await this.alertController.create({
      header: 'Delete reading?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.readingsService.deleteReading(id).subscribe(() => {
              this.showDeletedNotification()
              this.loadReadings()
            })
          },
        },
      ],
    });


    await alert.present();
  }

  async showDeletedNotification() {
    const toast = await this.toastController.create({
      message: 'reading deleted',
      color: "success",
      duration: 5000,
      position: 'top',
      icon: 'thumbs-up-outline'
    });

    await toast.present();
  }

  onYearsChanged(y: string[]) {
    this.searchYears = y
    this.loadReadings()
  }


}
