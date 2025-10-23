import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService} from "@/_services/api.service";
import {first} from "rxjs/operators";

@Component({
    selector: '[rsl-tab-contact]',
    templateUrl: './tab-contact.component.html',
    styleUrls: ['./tab-contact.component.css']
})
export class TabContactComponent implements OnInit {
    public contactForm: FormGroup;
    public loading = false;
    public submitted = false;

    constructor(private formBuilder: FormBuilder, private apiService: ApiService) {}

    ngOnInit() {
        this.contactForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required],
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.contactForm.invalid) {
            return;
        }

        this.loading = true;
        this.apiService.sendContactForm(this.contactForm.controls.email.value, this.contactForm.controls.message.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false
                    this.submitted = false
                    this.contactForm.patchValue({
                        email: '',
                        message: ''
                    });
                },
                error => {
                    this.loading = false
                })
    }

    get email() { return this.contactForm.get('email') }
    get message() { return this.contactForm.get('message') }
}
