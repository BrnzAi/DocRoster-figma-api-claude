import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: '[rsl-footer]',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    constructor() { }

    @Output() tabSwitch: EventEmitter<string> = new EventEmitter<string>()

    public navigateTo(target:string){
        this.tabSwitch.emit(target)
    }

    ngOnInit() { }
}
