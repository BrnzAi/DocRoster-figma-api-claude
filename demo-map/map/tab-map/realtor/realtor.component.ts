import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, ElementRef, HostBinding } from '@angular/core';
import { Realtor } from '@/_models/realtor.model'
import { select, Store } from '@ngrx/store';
import { IAppState } from '@/_store/app.state'
import { GetActiveRealtor } from '@/_store/selectors/realtors.selector';
import { SetActiveRealtor, ClearActiveRealtor } from '@/_store/actions/realtors.actions';
import { ConfigService } from '@/_services/config.service';
import { ClearActiveMarker } from "@/_store/actions/markers.actions";
import {Marker} from "@/_models/marker.model";
import {GetActiveMarker} from "@/_store/selectors/markers.selector";

@Component({
    selector: 'rsl-realtor',
    templateUrl: './realtor.component.html',
    styleUrls: ['./realtor.component.css']
})
export class RealtorComponent implements OnInit {
    @Input() public realtor:Realtor
    public isHovered:boolean = false
    public isActive:boolean = false
    public isTooltipOpened = false
    public activeMarker: Marker
    public nativeElement
    public paymentConfig: any
    @HostBinding('class.active') get hostActive() { return this.isHovered || this.isTooltipOpened || this.isActive }

    constructor(
        private store: Store<IAppState>,
        element: ElementRef,
    ) {
        this.nativeElement = element.nativeElement

        this.store.pipe(select(GetActiveRealtor))
            .subscribe(realtor => {
                if(realtor && this.realtor){
                    this.isActive = realtor.id == this.realtor.id
                } else {
                    this.isActive = false
                }
            })

        this.store.pipe(select(GetActiveMarker))
            .subscribe(marker => {
                setTimeout(() => {
                    this.activeMarker = marker
                }, 0)
            })

        this.paymentConfig = ConfigService.Settings.pricing
    }

    ngOnInit() {}

    public showChat() {
        this.store.dispatch(new SetActiveRealtor(this.realtor.id))
    }

    public hideChat() {
        this.store.dispatch(new ClearActiveRealtor())
        this.store.dispatch(new ClearActiveMarker())
    }

    public isMobile(){
        return !window.matchMedia('(min-width: 992px)').matches
    }

    get allLanguages() {
        if (this.realtor.meta.foreign_languages) {
            return this.realtor.meta.foreign_languages.map(function(elem){
                return elem.item_text;
            }).join(", ");
        } else {
            return "";
        }
    }

    get areas() {
        if (this.realtor.meta.areas) {
            return this.realtor.meta.areas.filter(function(elem){
                return elem.name === 'Residential' || elem.name === 'Commercial';
            }).map(function(elem){
                return elem.name === 'Commercial' ? '<b><i>' + elem.name + '</i></b>' : elem.name;
            }).join(", ");
        } else {
            return "";
        }
    }

    get allAreas() {
        if (this.realtor.meta.areas) {
            return this.realtor.meta.areas.map(function(elem){
                return elem.name;
            }).join(", ");
        } else {
            return "";
        }
    }

    get website() {
        if(/https?:\/\//g.test(this.realtor.meta.website)) {
            return this.realtor.meta.website
        } else {
            return this.realtor.meta.website && this.realtor.meta.website.length ? 'http://' + this.realtor.meta.website : ''
        }
    }
}
