import {TranslateService} from "@ngx-translate/core";
import * as moment from 'moment';

export class LocaleHelper {
    public static defaultLocaleId = 'en';
    public static implementedLocales = [LocaleHelper.defaultLocaleId, 'de'];

    public static getCurrentLocale(): string {
        for (const id in LocaleHelper.implementedLocales) {
            const localeId = LocaleHelper.implementedLocales[id];
            if (navigator.language.startsWith(localeId)) {
                return localeId;
            }
        }
        return this.defaultLocaleId;
    }

    public static initTranslations(translateService: TranslateService) {
        translateService.addLangs(LocaleHelper.implementedLocales);
        // this language will be used as a fallback when a translation isn't found in the current language
        translateService.setDefaultLang(LocaleHelper.defaultLocaleId);

        translateService.use(LocaleHelper.getCurrentLocale());

        moment.locale(translateService.getBrowserLang());
    }


}