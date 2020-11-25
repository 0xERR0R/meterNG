import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {ButtonsModule} from 'ngx-bootstrap/buttons';

import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {ChartsModule} from 'ng2-charts';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ChartComponent} from './components/chart/chart.component';
import {NewRecordComponent} from './components/new-record/new-record.component';
import {NotificationErrorHandler} from './shared/errorhandler';
import {NavComponent} from './components/nav/nav.component';
import {ReadingsComponent} from './components/readings/readings.component';
import {LocaleHelper} from './shared/LocaleHelper';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ReadingDeleteConfirmationComponent} from './components/reading-delete-confirmation/reading-delete-confirmation.component';
import {AdminComponent} from './components/admin/admin.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {LastReadingComponent} from './components/dashboard/last-reading/last-reading.component';
import {LastValuesComponent} from './components/dashboard/last-values/last-values.component';
import {Consumption2MonthComponent} from './components/dashboard/consumption2-month/consumption2-month.component';
import {StatisticsComponent} from './components/dashboard/statistics/statistics.component';

registerLocaleData(localeDe);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        ChartComponent,
        NewRecordComponent,
        NavComponent,
        ReadingsComponent,
        ReadingDeleteConfirmationComponent,
        AdminComponent,
        DashboardComponent,
        LastReadingComponent,
        LastValuesComponent,
        Consumption2MonthComponent,
        StatisticsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        LoadingBarRouterModule,
        LoadingBarHttpClientModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FontAwesomeModule,
        ChartsModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ModalModule.forRoot(),
        ButtonsModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
    ],
    providers: [{provide: ErrorHandler, useClass: NotificationErrorHandler},
        {provide: LOCALE_ID, useFactory: () => LocaleHelper.getCurrentLocale()}
    ],
    entryComponents: [ReadingDeleteConfirmationComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
