import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Location } from '../../_models/location.model'
import { MapBounds } from '../../_models/map-bounds.model'
import { Marker } from '../../_models/marker.model'
import { Realtor } from '@/_models/realtor.model'
import { SetMapBounds } from '../../_store/actions/mapbounds.actions';
import { GetMainLocation } from '../../_store/selectors/mainlocation.selector';
import { SetMainLocation } from '../../_store/actions/mainlocation.actions';
import { GetVisibleMapMarkers, GetTmpMarker } from '../../_store/selectors/markers.selector';
import {
    UpdateTmpMarkerCoords,
    DeleteMapMarker,
    ClearActiveMarker,
    SetActiveMarker
} from '../../_store/actions/markers.actions';
import { GetMapRealtors } from '../../_store/selectors/realtors.selector';
import { SetActiveRealtor, ClearActiveRealtor } from '../../_store/actions/realtors.actions';
import { GetCurrentUser } from '@/_store/selectors/currentuser.selector'
import { IAppState } from '../../_store/app.state'

import { ApiService } from '@/_services/api.service';
import { AuthenticationService } from '@/_services/authentication.service';

@Component({
    selector: '[rsl-gmap]',
    templateUrl: './gmap.component.html',
    styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {
    @Input() public mapHeight: number
    @Output() toMap: EventEmitter<string> = new EventEmitter<string>()
    public mainLocation: Location
    private _mapBounds: MapBounds
    private _mapBoundsChanged: Subject<string> = new Subject<string>()
    public tmpMarker: Marker;
    public realtyMarkers: Marker[]
    public tmpMarkerIcon: any = {
        url: '/assets/images/logo-pin.png',
        scaledSize: {
            width: 20,
            height: 23.5
        }
    }
    private mapRealtors: Realtor[]
    public user: any

    constructor(
        private store: Store<IAppState>,
        private authenticationService: AuthenticationService,
        private apiService: ApiService
    ){
        store.pipe(select(GetTmpMarker))
            .subscribe(tmpMarker => {
                this.tmpMarker = tmpMarker;
            });
        store.pipe(select(GetMainLocation))
            .subscribe(mainLocation => {
                this.mainLocation = mainLocation;
            });
        store.pipe(select(GetMapRealtors))
            .subscribe(realtors => {
                this.mapRealtors = realtors
            })

        this._mapBoundsChanged.pipe(
                debounceTime(400),
                distinctUntilChanged())
            .subscribe(bounds => this.boundsChanged(bounds))
        if ("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(pos => this.mainLocationChanged(pos));
        }
    }

    ngOnInit() {
        this.apiService.loadMarkers()
        this.apiService.loadRealtors()

        this.store.pipe(select(GetVisibleMapMarkers))
            .subscribe(realtyMarkers => {
                this.realtyMarkers = realtyMarkers;
            })

        this.store.select(GetCurrentUser).subscribe(user => {
            if(user){
                this.user = user
            }
        })
    }

    public _boundsChange(mapBounds) {
        this._mapBoundsChanged.next(mapBounds);
    }

    public boundsChanged(mapBounds) {
        this.store.dispatch(new SetMapBounds(mapBounds))
        this._mapBounds = mapBounds;
    }

    public mainLocationChanged(centerPosition) {
        this.store.dispatch(new SetMainLocation({
            latitude: centerPosition.coords.latitude,
            longitude: centerPosition.coords.longitude,
            zoom: 15
        }))
    }

    public dragendTmpMarker(event) {
        this.store.dispatch(new UpdateTmpMarkerCoords({
            latitude: event.coords.lat,
            longitude: event.coords.lng,
        }))
    }

    public setRealtorActive(realtorId){
        const timeout = this.isMobile() ? 0 : 100;

        this.toMap.emit()
        setTimeout(() => {
            this.store.dispatch(new ClearActiveRealtor())
        }, timeout)
        setTimeout(() => {
            this.store.dispatch(new SetActiveRealtor(realtorId))
        }, timeout)
    }

    public setMarkerActive(id){
        const timeout = this.isMobile() ? 0 : 100;

        this.toMap.emit()
        setTimeout(() => {
            this.store.dispatch(new ClearActiveMarker())
        }, timeout)
        setTimeout(() => {
            this.store.dispatch(new SetActiveMarker(id))
        }, timeout)
    }

    public getRealtorName(realtorId) {
        if (this.mapRealtors) {
            const realtor = this.mapRealtors.find(function(e) {return e.id === realtorId})

            if (realtor) {
                return realtor.name
            }
        }

        return ' '
    }

    public deleteAd(marker) {
        this.apiService.deleteMarker(marker).then(()=>{
            this.store.dispatch(new DeleteMapMarker(marker))
            this.authenticationService.refreshMe()
        }).catch((error) => {
            console.log(error)
        });

        return false
    }

    public isMobile(){
        return !window.matchMedia('(min-width: 992px)').matches
    }
}
