import {Component, OnInit} from '@angular/core';
import {ReadingsService} from "../../services/readings.service";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  fileToUpload: File = null;
  selectedType: string = 'Full';

  constructor(private readingsService: ReadingsService, private toastController: ToastController) {
  }

  ngOnInit() {
  }

  handleFileInput(event) {
    this.fileToUpload = event.target.files.item(0);
  }

  onSubmitImport() {
    this.readingsService.uploadImportFile(this.fileToUpload, this.selectedType === "Incremental") //
      .subscribe(res => {
        this.showNotification(res).then()
      })
  }

  async showNotification(cnt: number) {
    const toast = await this.toastController.create({
      message: cnt + ' record(s) imported',
      color: "success",
      duration: 5000,
      position: 'top',
      icon: 'thumbs-up-outline'
    });

    await toast.present();
  }
}
