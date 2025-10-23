import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthenticationService} from '@/_services/authentication.service';
import { first } from 'rxjs/operators';
import { FakeapiService } from '@/_services/fakeapi.service';

@Component({
    selector: '[rsl-tab-login]',
    templateUrl: './tab-login.component.html',
    styleUrls: ['./tab-login.component.css']
})
export class TabLoginComponent implements OnInit {
    @Output() toRegister: EventEmitter<string> = new EventEmitter<string>()
    @Output() toMap: EventEmitter<string> = new EventEmitter<string>()
    public loginForm: FormGroup;
    public loading = false;
    public submitted = false;
    public formError: string = ''
    
    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private apiService: FakeapiService
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
    
    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(
            this.loginForm.controls.email.value,
            this.loginForm.controls.password.value
        ).pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                this.toMap.emit()
            },
            error => {
                console.log(error)
                this.formError = `<p>Sorry this email or password is wrong</p>`
                setTimeout(() => {
                    this.formError = ''
                }, 5000)
                this.loading = false;
            });
    }
    
    get email() { return this.loginForm.get('email') }
    get password() { return this.loginForm.get('password') }
    
}