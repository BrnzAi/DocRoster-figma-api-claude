import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: '[rsl-tab-privacy]',
    templateUrl: './tab-privacy.component.html',
    styleUrls: ['./tab-privacy.component.css']
})
export class TabPrivacyComponent implements OnInit {
    @Output() toMap: EventEmitter<string> = new EventEmitter<string>()

    constructor() { }

    ngOnInit() { }

}
