import { Component, OnInit, NgZone, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { SetMainLocation } from '../../_store/actions/mainlocation.actions';
import { GetCurrentUser } from '@/_store/selectors/currentuser.selector'
import { IAppState } from '@/_store/app.state'

@Component({
    selector: '[rsl-header]',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    constructor(
        private cdRef:ChangeDetectorRef,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private store: Store<IAppState>
    ){ 
        this.store.select(GetCurrentUser).subscribe(user => {
            if(user && this.user !== user){
                this.user = user
            }
        })
    }
    
    @Input() public isAuthorised: boolean
    @Output() tabSwitch: EventEmitter<string> = new EventEmitter<string>()
    @Output() menuSwitch: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('navContainer', {static: false}) navContainer: ElementRef;
    @ViewChild('mainNav', {static: false}) mainNav: ElementRef;
    @ViewChild("search",{ static: false }) public searchElement: ElementRef
    @ViewChild("searchMobile",{ static: false }) public searchMobileElement: ElementRef

    public user: any
    public links = [
        {
            'title': 'Map',
            'target': 'map',
            'guest': true
        },
        {
            'title': 'Pricing',
            'target': 'pricing',
            'guest': true
        },
        {
            'title': 'About',
            'target': 'about',
            'guest': true
        },
        {
            'title': 'Contact',
            'target': 'contact',
            'guest': true
        }
    ]
    @Input() public activeLink: string = 'map'
    private geoCoder: google.maps.Geocoder;

    ngOnInit() {
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;
            let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
              types: ["address"]
            });
            let autocompleteMobile = new google.maps.places.Autocomplete(this.searchMobileElement.nativeElement, {
              types: ["address"]
            });
            autocomplete.addListener("place_changed", () => this.doSearch(autocomplete));
            autocompleteMobile.addListener("place_changed", () => this.doSearch(autocompleteMobile));
        })
    }
    
    doSearch(autocomplete: google.maps.places.Autocomplete) {
        this.tabSwitch.emit('map')

        this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
                  return;
            }
            this.store.dispatch(new SetMainLocation({
                latitude: place.geometry.location.lat(),  
                longitude: place.geometry.location.lng(),
                zoom: 14
            }))
        });
    }

    public navigateTo(target:string){
        if(target !== this.activeLink){
            this.tabSwitch.emit(target)
        }
    }
    
    public showMenu(onoff: boolean){
        this.menuSwitch.emit(onoff)
    }
    
    public isMobile(){
        return !window.matchMedia('(min-width: 992px)').matches
    }

    get numberOfPins () {
        if (this.user && this.user.plan && this.user.plan.products) {
            return ' (' + (0 + this.user.plan.products.total) + '/' + (0 + this.user.plan.products.limit) + ')'
        } else {
            return ''
        }
    }
}
