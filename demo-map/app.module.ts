import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { AgmCoreModule } from '@agm/core';
import { StripeCheckoutModule } from 'ng-stripe-checkout';
import { TakeSpaceComponent } from './_common/take-space/take-space.component';
import { HeaderComponent } from './_common/header/header.component';
import { FooterComponent } from './_common/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapComponent } from './map/map.component';
import { TabMapComponent } from './map/tab-map/tab-map.component';
import { TabPricingComponent } from './map/tab-pricing/tab-pricing.component';
import { TabAboutComponent } from './map/tab-about/tab-about.component';
import { TabContactComponent } from './map/tab-contact/tab-contact.component';
import { TabPlaceadComponent } from './map/tab-placead/tab-placead.component';
import { TabLoginComponent } from './map/tab-login/tab-login.component';
import { TabRegisterComponent } from './map/tab-register/tab-register.component';
import { TabPrivacyComponent } from './map/tab-privacy/tab-privacy.component';
import { GmapComponent } from './map/gmap/gmap.component';
import { RealtorComponent } from './map/tab-map/realtor/realtor.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { appReducers } from './_store/app.reducer';

import { ConfigService } from './_services/config.service';
import { TabLogoutComponent } from './map/tab-logout/tab-logout.component';
import { DetailsComponent } from './map/tab-map/details/details.component';
import { HomeComponent } from './home/home.component';

export function initConfig(appConfig: ConfigService) {
    return () => appConfig.load();
}

    @NgModule({
    declarations: [
        AppComponent,
        TakeSpaceComponent,
        HeaderComponent,
        FooterComponent,
        MapComponent,
        TabMapComponent,
        TabPricingComponent,
        TabAboutComponent,
        TabContactComponent,
        GmapComponent,
        TabPlaceadComponent,
        TabLoginComponent,
        TabRegisterComponent,
        TabPrivacyComponent,
        RealtorComponent,
        TabLogoutComponent,
        DetailsComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        StoreModule.forRoot(appReducers),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        StripeCheckoutModule,
        AgmCoreModule.forRoot({
            apiKey: 'GOOGLE_MAPS_API_KEY_PLACEHOLDER', // Replace with your own key
            libraries: ['places']
        }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        BrowserAnimationsModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: [
        ConfigService,
        { provide: APP_INITIALIZER, useFactory: initConfig, deps: [ConfigService], multi: true }
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
