import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AuthenticationService } from '@/_services/authentication.service';
import { ApiService } from '@/_services/api.service';
import { ConfigService } from '@/_services/config.service';
import { first } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { IAppState } from '@/_store/app.state'
import { GetCurrentUser, GetUserBot } from '@/_store/selectors/currentuser.selector'
import { CustomValidator } from '../shared/validation';

class BuyerAgent {
    constructor(public id:number, public name:string) {}
}

@Component({
    selector: '[rsl-tab-logout]',
    templateUrl: './tab-logout.component.html',
    styleUrls: ['./tab-logout.component.css']
})


export class TabLogoutComponent implements OnInit {
    @Output() toMap: EventEmitter<string> = new EventEmitter<string>()
    public settingsForm: FormGroup;
    public loading = false;
    public submitted = false;
    public avatarImg: any
    public user: any
    public paymentConfig: any

    public areas = [];
    public languagesList = [];
    public selectedAreas = [];
    public selectedLanguages = [];
    public areasSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 5,
        allowSearchFilter: true
    };
    public languagesListSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
    };

    public buyerAgents = [
        new BuyerAgent(1, 'Real Estate Agent'),
        new BuyerAgent(2, 'Real Estate Broker')
    ]

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private apiService: ApiService,
        private store: Store<IAppState>
    ) {
        this.areas = ConfigService.Settings.areas
        this.languagesList = ConfigService.Settings.languagesList
        this.paymentConfig = ConfigService.Settings.pricing
    }

    ngOnInit() {
        this.settingsForm = this.formBuilder.group({
            name: ['', Validators.required],
            companyname: ['', Validators.required],
            website: ['', CustomValidator.urlValidator],
            zoom: [''],
            buyer_agent: ['', Validators.required],
            experience: ['', Validators.required],
            aboutcompany: ['', Validators.required],
            avatar: ['']
        });

        this.store.select(GetCurrentUser).subscribe(user => {
            if(user){
                this.user = user
                this.settingsForm.patchValue({
                    name: user.name,
                    companyname: user.meta.companyname,
                    website: user.meta.website,
                    zoom: user.meta.zoom,
                    buyer_agent: user.meta.buyer_agent ? this.buyerAgents.find(agent => agent.id == user.meta.buyer_agent.id) : '',
                    experience: user.meta.experience,
                    aboutcompany: user.meta.aboutcompany,
                });

                this.selectedAreas = user.meta.areas
                this.selectedLanguages = user.meta.foreign_languages
            }
        })
    }

    onAvatarChanged(files: FileList) {
        if (this.user) {
            let file = files.item(0)
            combineLatest(
                this.store.select(GetCurrentUser),
                this.store.select(GetUserBot)
            ).pipe(first()).subscribe(([user, bot]) => {
                this.apiService.uploadFile(bot, file, file.name).then(response => {
                    if (response.status) {
                        let meta = user.meta
                        meta.avatar = response.url
                        this.authenticationService.update(this.settingsForm.controls.name.value, meta).pipe(first())
                            .subscribe(
                                data => {
                                    this.loading = false
                                    this.apiService.loadRealtors()
                                },
                                error => {
                                    this.loading = false
                                });
                    }
                })
            })
        }
    }

    logout() {
        this.authenticationService.logout()
        this.toMap.emit()
    }

    onSubmit() {
        this.submitted = true;
        if (this.settingsForm.invalid) {
            return;
        }

        this.loading = true;
        const subscription = this.store.select(GetCurrentUser).subscribe(user => {
            let meta = user.meta

            meta.companyname = this.settingsForm.controls.companyname.value,
            meta.website = this.settingsForm.controls.website.value,
            meta.zoom = this.settingsForm.controls.zoom.value,
            meta.buyer_agent = this.settingsForm.controls.buyer_agent.value,
            meta.experience = this.settingsForm.controls.experience.value,
            meta.aboutcompany = this.settingsForm.controls.aboutcompany.value,
            meta.areas = this.selectedAreas,
            meta.foreign_languages = this.selectedLanguages,
            this.authenticationService.update(this.settingsForm.controls.name.value, meta)
                .pipe(first())
                .subscribe(
                    data => {
                        subscription.unsubscribe()

                        this.apiService.setBotUsername(user.meta.bot_id, this.settingsForm.controls.name.value)
                        this.apiService.setBotCompany(user.meta.bot_id, this.settingsForm.controls.companyname.value)

                        this.loading = false
                        this.apiService.loadRealtors()
                    },
                    error => {
                        this.loading = false
                    })
        })

    }

    get name() { return this.settingsForm.get('name') }
    get companyname() { return this.settingsForm.get('companyname') }
    get website() { return this.settingsForm.get('website') }
    get zoom() { return this.settingsForm.get('zoom') }
    get buyer_agent() { return this.settingsForm.get('buyer_agent') }
    get experience() { return this.settingsForm.get('experience') }
    get aboutcompany() { return this.settingsForm.get('aboutcompany') }
    get avatar() { return this.settingsForm.get('avatar') }
}
