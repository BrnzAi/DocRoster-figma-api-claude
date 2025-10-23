import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AuthenticationService } from '@/_services/authentication.service';
import { ApiService } from '@/_services/api.service';
import { ConfigService } from '@/_services/config.service';
import { select, Store } from '@ngrx/store';
import { IAppState } from '@/_store/app.state'
import { GetUserBot } from '@/_store/selectors/currentuser.selector'
import { first } from 'rxjs/operators';
import { CustomValidator } from '../shared/validation';

class BuyerAgent {
    constructor(public id:number, public name:string) {}
}

@Component({
    selector: '[rsl-tab-register]',
    templateUrl: './tab-register.component.html',
    styleUrls: ['./tab-register.component.css']
})


export class TabRegisterComponent implements OnInit {
    @Output() toLogin: EventEmitter<string> = new EventEmitter<string>()
    @Output() toMap: EventEmitter<string> = new EventEmitter<string>()
    public registerForm: FormGroup;
    public loading = false;
    public submitted = false;
    public avatarImg: any
    public logoImg: any
    public formError: string = ''

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

    private passwordMatcher(control: FormControl): { [s: string]: boolean } {
        if (this.registerForm && (control.value !== this.registerForm.controls.password.value)) {
            return { passwordNotMatch: true };
        }
        return null;
    }

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private apiService: ApiService,
        private store: Store<IAppState>
    ) {
        this.areas = ConfigService.Settings.areas
        this.languagesList = ConfigService.Settings.languagesList
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            password_confirm: ['', [Validators.required, this.passwordMatcher.bind(this)]],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            companyname: ['', Validators.required],
            website: ['', CustomValidator.urlValidator],
            zoom: [''],
            buyer_agent: ['', Validators.required],
            experience: ['', Validators.required],
            aboutcompany: ['', Validators.required],
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(
            this.registerForm.controls.email.value,
            this.registerForm.controls.password.value,
            this.registerForm.controls.firstname.value,
            this.registerForm.controls.lastname.value,
            {
                companyname: this.registerForm.controls.companyname.value,
                website: this.registerForm.controls.website.value,
                zoom: this.registerForm.controls.zoom.value,
                buyer_agent: this.registerForm.controls.buyer_agent.value,
                experience: this.registerForm.controls.experience.value,
                aboutcompany: this.registerForm.controls.aboutcompany.value,
                avatar: this.avatarImg,
                logo: this.logoImg,
                areas: this.selectedAreas,
                foreign_languages: this.selectedLanguages,
            }
        ).pipe(first())
        .subscribe(
            data => {
                if (typeof data !== 'boolean' && (data.plan.mode === 'free' || data.plan.mode === 'subscription' && data.plan.status === 'trial')) {
                    const subscription = this.store.select(GetUserBot).subscribe(
                        (botId) => {
                            if (botId) {
                                setTimeout(() => {
                                    subscription.unsubscribe()

                                    this.apiService.makeConnection()
                                })
                            }
                        })
                }

                this.loading = false
                this.toMap.emit()

            },
            error => {
                console.log(error.error.error)
                this.formError = `<p>${error.error.error}</p>`
                setTimeout(() => {
                    this.formError = ''
                }, 5000)
                this.loading = false
            });
    }

    get email() { return this.registerForm.get('email') }
    get password() { return this.registerForm.get('password') }
    get password_confirm() { return this.registerForm.get('password_confirm') }
    get firstname() { return this.registerForm.get('firstname') }
    get lastname() { return this.registerForm.get('lastname') }
    get companyname() { return this.registerForm.get('companyname') }
    get website() { return this.registerForm.get('website') }
    get zoom() { return this.registerForm.get('zoom') }
    get buyer_agent() { return this.registerForm.get('buyer_agent') }
    get experience() { return this.registerForm.get('experience') }
    get aboutcompany() { return this.registerForm.get('aboutcompany') }
    get avatar() { return this.registerForm.get('avatar') }
    get logo() { return this.registerForm.get('logo') }
}
