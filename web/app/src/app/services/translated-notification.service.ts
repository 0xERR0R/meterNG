import {Injectable} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class TranslatedNotificationService {

    constructor(private notificationService: NotificationsService,
                private translateService: TranslateService) {
    }

    info(title: string, content: string, params?: Object) {
        this.translateService.get([title, content], params).subscribe((res: string[]) => {
            this.notificationService.info(res[title], res[content], {
                timeOut: 5000,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true
            })
        })
    }
}
