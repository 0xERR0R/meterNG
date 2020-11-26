import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LocaleHelper} from "./shared/LocaleHelper";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private translateService: TranslateService) {
        LocaleHelper.initTranslations(translateService)

    }


}
