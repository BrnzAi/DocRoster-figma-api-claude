import { Injectable } from '@angular/core';
import { Config } from '@/_models/config.model';
import { HttpClient, HttpBackend, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    static Settings: Config;
    private http: HttpClient;
    constructor(private httpBackEnd: HttpBackend) {
        this.http = new HttpClient(httpBackEnd);
    }
    load() {
        const jsonFile = 'assets/config/config.json';
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: Config) => {
               ConfigService.Settings = <Config>response;
               this.loadLanguagesList()
               this.loadPricings()
               this.loadAreas()
               resolve();
            }).catch((response: any) => {
               reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }

    loadPricings() {
        this.http.get(ConfigService.Settings.api.apiUrl+'subscription-plans/'+ConfigService.Settings.api.portalId)
            .toPromise()
            .then((response: any) => {
                ConfigService.Settings.pricing.plans.adspace = response.plans.find(plan => plan.id == "5dc44b2efe12ec0271965854");
                ConfigService.Settings.pricing.plans.professional = response.plans.find(plan => plan.id == "60bdfc480993b8185292ed1e");
                ConfigService.Settings.pricing.plans.ultimate = response.plans.find(plan => plan.id == "60bdfc923f8129192fbf237b");
                // ConfigService.Settings.pricing.plans.free = response.plans.find(plan => plan.id == "5e009ee4767a653d340ab27e");
                ConfigService.Settings.pricing.plans.professional_monthly = response.plans.find(plan => plan.id == "60bdfbf4bbf589764dd62ec4");
                ConfigService.Settings.pricing.plans.ultimate_monthly = response.plans.find(plan => plan.id == "60bdfcd40993b8192e92ee30");
                ConfigService.Settings.pricing.plans.ten_pins = response.plans.find(plan => plan.id == "5e873636616a64734b11af7b");
        }).catch((error: any) => {
                console.log(error)
            });
    }

    loadLanguagesList() {
        ConfigService.Settings.languagesList = [
            { item_id: 1, item_text: 'Mandarin Chinese' },
            { item_id: 2, item_text: 'Spanish' },
            { item_id: 3, item_text: 'English' },
            { item_id: 4, item_text: 'Hindi' },
            { item_id: 5, item_text: 'Bengali' },
            { item_id: 6, item_text: 'Portuguese' },
            { item_id: 7, item_text: 'Russian' },
            { item_id: 8, item_text: 'Japanese' },
            { item_id: 9, item_text: 'Western Punjabi' },
            { item_id: 10, item_text: 'Marathi' },
            { item_id: 11, item_text: 'Telugu' },
            { item_id: 12, item_text: 'Wu Chinese' },
            { item_id: 13, item_text: 'Turkish' },
            { item_id: 14, item_text: 'Korean' },
            { item_id: 15, item_text: 'French' },
            { item_id: 16, item_text: 'German' },
            { item_id: 17, item_text: 'Vietnamese' },
            { item_id: 18, item_text: 'Tamil' },
            { item_id: 19, item_text: 'Yue Chinese' },
            { item_id: 20, item_text: 'Urdu' },
            { item_id: 21, item_text: 'Javanese' },
            { item_id: 22, item_text: 'Italian' },
            { item_id: 23, item_text: 'Egyptian Arabic' },
            { item_id: 24, item_text: 'Gujarati' },
            { item_id: 25, item_text: 'Iranian Persian' },
            { item_id: 26, item_text: 'Bhojpuri' },
            { item_id: 27, item_text: 'Min Nan Chinese' },
            { item_id: 28, item_text: 'Hakka Chinese' },
            { item_id: 29, item_text: 'Jin Chinese' },
            { item_id: 30, item_text: 'Hausa' },
            { item_id: 31, item_text: 'Kannada' },
            { item_id: 32, item_text: 'Indonesian' },
            { item_id: 33, item_text: 'Polish' },
            { item_id: 34, item_text: 'Yoruba' },
            { item_id: 35, item_text: 'Xiang Chinese' },
            { item_id: 36, item_text: 'Malayalam' },
            { item_id: 37, item_text: 'Odia' },
            { item_id: 38, item_text: 'Maithili' },
            { item_id: 39, item_text: 'Burmese' },
            { item_id: 40, item_text: 'Eastern Punjabi' },
            { item_id: 41, item_text: 'Sunda' },
            { item_id: 42, item_text: 'Sudanese Arabic' },
            { item_id: 43, item_text: 'Algerian Arabic' },
            { item_id: 44, item_text: 'Moroccan Arabic' },
            { item_id: 45, item_text: 'Ukrainian' },
            { item_id: 46, item_text: 'Igbo' },
            { item_id: 47, item_text: 'Northern Uzbek' },
            { item_id: 48, item_text: 'Sindhi' },
            { item_id: 49, item_text: 'North Levantine Arabic' },
            { item_id: 50, item_text: 'Romanian' },
            { item_id: 51, item_text: 'Tagalog' },
            { item_id: 52, item_text: 'Dutch' },
            { item_id: 53, item_text: 'Saʽidi Arabic' },
            { item_id: 54, item_text: 'Gan Chinese' },
            { item_id: 55, item_text: 'Amharic' },
            { item_id: 56, item_text: 'Northern Pashto' },
            { item_id: 57, item_text: 'Magahi' },
            { item_id: 58, item_text: 'Thai' },
            { item_id: 59, item_text: 'Saraiki' },
            { item_id: 60, item_text: 'Khmer' },
            { item_id: 61, item_text: 'Chhattisgarhi' },
            { item_id: 62, item_text: 'Somali' },
            { item_id: 63, item_text: 'Malay' },
            { item_id: 64, item_text: 'Cebuano' },
            { item_id: 65, item_text: 'Nepali' },
            { item_id: 66, item_text: 'Mesopotamian Arabic' },
            { item_id: 67, item_text: 'Assamese' },
            { item_id: 68, item_text: 'Sinhala' },
            { item_id: 69, item_text: 'Northern Kurdish' },
            { item_id: 70, item_text: 'Hejazi Arabic' },
            { item_id: 71, item_text: 'Nigerian Fulfulde' },
            { item_id: 72, item_text: 'Bavarian' },
            { item_id: 73, item_text: 'South Azerbaijani' },
            { item_id: 74, item_text: 'Greek' },
            { item_id: 75, item_text: 'Chittagonian' },
            { item_id: 76, item_text: 'Kazakh' },
            { item_id: 77, item_text: 'Deccan' },
            { item_id: 78, item_text: 'Hungarian' },
            { item_id: 79, item_text: 'Kinyarwanda' },
            { item_id: 80, item_text: 'Zulu' },
            { item_id: 81, item_text: 'South Levantine Arabic' },
            { item_id: 82, item_text: 'Tunisian Arabic' },
            { item_id: 83, item_text: 'Sanaani Spoken Arabic' },
            { item_id: 84, item_text: 'Min Bei Chinese' },
            { item_id: 85, item_text: 'Southern Pashto' },
            { item_id: 86, item_text: 'Rundi' },
            { item_id: 87, item_text: 'Czech' },
            { item_id: 88, item_text: 'Taʽizzi-Adeni Arabic' },
            { item_id: 89, item_text: 'Uyghur' },
            { item_id: 90, item_text: 'Min Dong Chinese' },
            { item_id: 91, item_text: 'Sylheti' },
        ];
    }

    loadAreas() {
        ConfigService.Settings.areas = [
            {id: 1, name: 'Residential'},
            {id: 2, name: 'Commercial'},
            {id: 3, name: 'Rentals'},
            {id: 4, name: 'Local Real Estate Investors'},
            {id: 5, name: 'International Real Estate Investors'},
        ];
    }
}
