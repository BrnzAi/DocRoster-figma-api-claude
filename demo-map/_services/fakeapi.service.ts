import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class FakeapiService {
    constructor(private httpClient: HttpClient) { }
    
    public getMarkers(){
        return this.httpClient.get<any>('assets/fakeapi/markers.json')
    }
    
    public getRealtors(){
        return this.httpClient.get<any>('assets/fakeapi/realtors.json')
    }
    
    public addMarker(marker){
        return this.httpClient.post<any>('assets/fakeapi/realtors.json', marker)
    }
}
