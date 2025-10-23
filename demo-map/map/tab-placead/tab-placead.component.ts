import { Component, Output, EventEmitter, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Store } from '@ngrx/store';
import { SetMainLocation } from '@/_store/actions/mainlocation.actions';
import { AddTmpMarker } from '@/_store/actions/markers.actions';
import { GetMapMarkers } from '@/_store/selectors/markers.selector';
import {GetCurrentUser, GetUserBot} from '@/_store/selectors/currentuser.selector'
import { ApiService } from '@/_services/api.service';
import { AuthenticationService } from '@/_services/authentication.service';
import { Marker } from '@/_models/marker.model'
import {combineLatest} from "rxjs";
import {first} from "rxjs/operators";

@Component({
    selector: '[rsl-tab-placead]',
    templateUrl: './tab-placead.component.html',
    styleUrls: ['./tab-placead.component.css']
})
export class TabPlaceadComponent implements OnInit {
    @Output() toMap: EventEmitter<string> = new EventEmitter<string>()
    public placeadForm: FormGroup;
    public loading = false
    public submitted = false
    public markerAdded = false
    public flyerImg: any
    public marketReportFile: any
    public user: any
    @ViewChild("search",{ static: false }) public searchElement: ElementRef

    constructor(
        private formBuilder: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private store: Store<any>,
        private authenticationService: AuthenticationService,
        private apiService: ApiService
    ) { }

    ngOnInit() {
        this.placeadForm = this.formBuilder.group({
            message: ['', Validators.required],
            flyer: [''],
            marketReport: [''],
        });
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
                types: ["address"]
            });
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                          return;
                    }
                    this.store.dispatch(new SetMainLocation({
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        zoom: 18
                    }))
                    const newMarker: Marker = {
                        id: 0,
                        realtor_id: 'AAA',
                        title: 'tmp',
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        draggable: true
                    };
                    this.store.dispatch(new AddTmpMarker(newMarker))
                    this.markerAdded = true
                });
            })
        })

        this.store.select(GetCurrentUser).subscribe(user => {
            if(user){
                this.user = user
            }
        })
    }

    onFlyerChanged(files: FileList) {
        if (this.user && this.user.plan && this.user.plan.mode !== 'free') {
            let file = files.item(0)
            combineLatest(
                this.store.select(GetCurrentUser),
                this.store.select(GetUserBot)
            ).pipe(first()).subscribe(([user, bot]) => {
                this.apiService.uploadFile(bot, file, file.name).then(response => {
                    if (response.status) {
                        this.flyerImg = response.url
                    }
                })
            })
        }
    }

    onMarketReportChanged(files: FileList) {
        if (this.user && this.user.plan && this.user.plan.mode !== 'free') {
            let file = files.item(0)
            combineLatest(
                this.store.select(GetCurrentUser),
                this.store.select(GetUserBot)
            ).pipe(first()).subscribe(([user, bot]) => {
                this.apiService.uploadFile(bot, file, file.name).then(response => {
                    if (response.status) {
                        this.marketReportFile = response.url
                    }
                })
            })
        }
    }

    onSubmit() {
        this.submitted = true;
        if (this.placeadForm.invalid) {
            return;
        }
        this.loading = true
        this.apiService.addMarker(this.message.value, this.flyerImg, this.marketReportFile).then(()=>{
            this.store.select(GetMapMarkers).subscribe(() => {
                this.authenticationService.refreshMe()
            })

            this.searchElement.nativeElement.value = ''
            this.markerAdded = false
            this.submitted = false
            this.flyerImg = undefined
            this.marketReportFile = undefined
            this.placeadForm = this.formBuilder.group({
                message: ['', Validators.required],
                flyer: [''],
                marketReport: [''],
            });

            this.loading = false
            this.toMap.emit()
        }).catch((response: any) => {
            this.loading = false
        });
    }

    get message() { return this.placeadForm.get('message') }
    get flyer() { return this.placeadForm.get('flyer') }
    get marketReport() { return this.placeadForm.get('marketReport') }

    get showForm() {
        return this.user && this.user.plan && this.user.plan.products && this.user.plan.products.limit > this.user.plan.products.total
    }
}
