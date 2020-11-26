import {Component, OnInit} from '@angular/core';
import {MeterService} from "../../services/meter.service";
import {TranslatedNotificationService} from "../../services/translated-notification.service";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    radioModel = 'Full';
    fileToUpload: File = null;
    buildInfo: String;

    constructor(private meterService: MeterService,
                private notificationService: TranslatedNotificationService) {
    }

    ngOnInit() {
        this.meterService.getBuildInfo() //
            .subscribe(res => this.buildInfo = res);
    }

    onSubmitImport() {
        this.meterService.uploadImportFile(this.fileToUpload, this.radioModel === "Incremental") //
            .subscribe(res => {
                this.notificationService.info("adminComponent.readingsImported.title", "adminComponent.readingsImported.text", {count: res})
            })
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
    }
}
