import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MeterService} from "../../services/meter.service";
import {Meter} from "../../models/meter";
import {Reading, ReadingType} from "../../models/reading";
import {ReadingsService} from "../../services/readings.service";
import {ToastController, ViewDidEnter} from '@ionic/angular';
import {Router} from "@angular/router";


@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {

  recordFormGroup: FormGroup;
  meters: Meter[] = [];
  controlConfig: { [p: string]: any };
  constructor(private toastController: ToastController, public formBuilder: FormBuilder, private meterService: MeterService, private readingsService: ReadingsService,
              private router: Router) { }


  ngOnInit() {
    this.meterService.getMeters().subscribe(res => {
      this.meters = res;
      this.controlConfig= {
        readingDate: [new Date().toISOString(), [Validators.required]]
      };
      this.meters.forEach(m => this.controlConfig["meter." + m.name] = ['', [Validators.required, Validators.min(0)]]);

      this.recordFormGroup = this.formBuilder.group(this.controlConfig);
    });
  }

  submitForm() {
    let date = this.recordFormGroup.value['readingDate'];
    let readings: Reading[] = []
    this.meters.forEach(meter => {
      let reading: Reading = {date: new Date(date), meterId: meter.name, value: this.recordFormGroup.value['meter.'+meter.name], type: ReadingType.MEASURE};
      readings.push(reading);

    })

    this.readingsService.storeReadings(readings) //
      .subscribe(res => {
        this.presentToast().then()
        this.router.navigateByUrl('/readings',{
          replaceUrl : true
        }).then();
        }
      )
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Hello World!',
      color: "success",
      duration: 5000,
      position: 'top',
      icon: 'thumbs-up-outline'
    });

    await toast.present();
  }

}
