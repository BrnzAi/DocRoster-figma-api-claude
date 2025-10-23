import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[rsl-map]',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    @Input() public activeTab = 'map'
    @Input() public isAuthorised: boolean
    @Output() switchTab: EventEmitter<string> = new EventEmitter<string>()

    constructor() { }

    ngOnInit() { }

    public toRegister() {
        this.switchTab.emit('register')
    }

    public toLogout() {
        this.switchTab.emit('logout')
    }

    public toLogin() {
        this.switchTab.emit('login')
    }

    public toMap() {
        this.switchTab.emit('map')
    }

    public toPlacead() {
        this.switchTab.emit('placead')
    }

    public toContact() {
        this.switchTab.emit('contact')
    }
}
