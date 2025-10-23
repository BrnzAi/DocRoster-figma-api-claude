import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { IAppState } from '@/_store/app.state'
import { ConfigService } from '@/_services/config.service';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { SetMapMarkers } from '@/_store/actions/markers.actions';

import { Realtor } from '@/_models/realtor.model';
import { Marker } from '@/_models/marker.model';
import { RoleEnum } from '@/_models/role.model';
import { SetUserCategory, SetUserBot } from '@/_store/actions/currentuser.actions';
import { GetUserCategory, GetAccessToken, GetCurrentUser, GetUserBot } from '@/_store/selectors/currentuser.selector'
import { GetTmpMarker, GetMapRealtorsIds } from '@/_store/selectors/markers.selector'
import { SetRealtors } from '@/_store/actions/realtors.actions'
import { ClearTmpMarker, AddMapMarker, DeleteMapMarker } from '@/_store/actions/markers.actions'

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiConfig: any
    private user: Realtor
    private accessToken: string

    constructor(private httpClient: HttpClient, private store: Store<IAppState>) {
        this.apiConfig = ConfigService.Settings.api;

        combineLatest(
            this.store.select(GetAccessToken),
            this.store.select(GetCurrentUser)
        ).subscribe(([token, user]) => {
            this.user = user
            this.accessToken = token
        })
    }

    private apiCall(endpoint: string, method: string, data:any={}, headers:any={}){
        const url = this.apiConfig.apiUrl+endpoint
        data.access_token = this.accessToken

        switch (method) {
            case 'get': {
                return this.httpClient.get<any>(url, {params:data})
            }
            case 'post': {
                return this.httpClient.post<any>(url, data, headers)
            }
            case 'put': {
                return this.httpClient.put<any>(url, data)
            }
            case 'delete': {
                return this.httpClient.delete<any>(url, {headers: new HttpHeaders({'X-Access-Token': this.accessToken})})
            }
        }
    }

    public createCategory(botId){
        const user = JSON.parse(localStorage.getItem('currentUser'))
        let categoryData = {
            name: user.email+'_RSL',
            title: user.name+' RSL',
            bot_id: botId,
            attributes: {
                realtor_id: {type:'string'},
                title: {type:'string'},
                latitude: {type:'number'},
                longitude: {type:'number'},
                market_report: {type:'string'},
            },
        }

        this.apiCall('category', 'post', categoryData).subscribe((response)=>{
            if(response.status){
                this.store.dispatch(new SetUserCategory(response.category_id))
                return true;
            } else {
                return false;
            }
        })
    }

    public getCategory(botId: string){
        this.apiCall('categories/'+botId, 'get').subscribe((response)=>{
            if(response.status){
                let botCategory = response.categories.find(cat => 'realtor_id' in cat.attributes)
                if(botCategory){
                    this.store.dispatch(new SetUserCategory(botCategory.category_id))
                    return true;
                } else {
                this.createCategory(botId)
                    return false;
                }
            } else {
                return false;
            }
        })
    }

    public getBot(){
        this.apiCall('bots', 'get').subscribe((response)=>{
            if(response.status){
                let bot = this._findBot(response.bots)
                if(bot){
                    this.store.dispatch(new SetUserBot(bot.bot_id))
                    this.getCategory(bot.bot_id)
                }
                return true;
            } else {
                return false;
            }
        })
    }

    public makeConnection(){
        this.store.select(GetUserBot).pipe(first()).subscribe(
            (botId) => {
                this.apiCall('connection/widget/' + botId, 'put', {
                    provider_data:{
                        token: botId+'widgettoken',
                        settings:{
                            position:"right",
                            width: 320,
                            height: 480,
                            resizeable: false,
                            color: '#f3705b',
                            theme: 'rounded',
                            type: 'button'
                        }
                },
                }).subscribe((response)=>{
                    if(response.status){
                        this.activateBot(botId)
                        this.enableBotNotifications(botId)
                        this.setBotUsername(botId, this.user.name)
                        this.setBotCompany(botId, this.user.meta.companyname)
                        return true;
                    } else {
                        return false;
                    }
                })
            })
    }

    public activateBot(botId:string){
        this.apiCall('bot/active/'+botId, 'post', {
                active:true
            }).subscribe((response)=>{
                return true
            })
    }

    public enableBotNotifications(botId:string){
        this.httpClient.post<any>(this.apiConfig.apiUrl+'bot/settings/'+botId, {
            notifications:true
        }, {headers: new HttpHeaders({'X-Access-Token': this.accessToken})}).subscribe((response)=>{
            return true
        })
    }

    public setBotUsername(botId:string, username:string) {
        this.apiCall('bot/'+botId, 'put', {
            name:username
        }).subscribe((response)=>{
            return true
        })
    }

    public setBotCompany(botId:string, company:string) {
        this.apiCall('variable/'+botId+'/company', 'put', {
            value:company
        }).subscribe((response)=>{
            return true
        })
    }

    async addMarker(title, flyerImg, marketReportFile){
        combineLatest(
            this.store.select(GetUserCategory),
            this.store.select(GetTmpMarker)
        ).subscribe(
            ([categoryId, marker]) => {
                this.apiCall('product', 'post', {
                    category_id: categoryId,
                    attributes: {
                        name: title,
                        realtor_id: this.user.id,
                        image: flyerImg,
                        market_report: marketReportFile,
                        title: title,
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                    }
                }).subscribe((response)=>{
                    if(response.status){
                        this.store.dispatch(new ClearTmpMarker())
                        this.store.dispatch(new AddMapMarker({
                                id: response.product_id,
                                realtor_id: this.user.id,
                                image: flyerImg,
                                market_report: marketReportFile,
                                title: title,
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                                draggable: false
                            }))
                        return true
                    } else {
                        return false
                    }
                })
            },
            error => {
                console.log(error)
                return false
            });
    }

    public loadMarkers(){
        this.apiCall('products/search', 'post', {
                portal_id: this.apiConfig.portalId,
                limit: 10000
            }).subscribe((response)=>{
                if(response.status){
                    this.store.dispatch(new SetMapMarkers(response.products.map(product => {
                        {
                            return <Marker>{
                                id: product.id,
                                realtor_id: product.attributes.realtor_id,
                                image: product.attributes.image,
                                title: product.attributes.title,
                                latitude: product.attributes.latitude,
                                longitude: product.attributes.longitude,
                                market_report: product.attributes.market_report,
                                draggable: false
                            }
                        }
                    })))
                    return true
                } else {
                    return false
                }
            })
    }

    public loadRealtors(){
        this.store.pipe(select(GetMapRealtorsIds))
            .subscribe(realtorsIds => {
                if(realtorsIds.length){
                    this.apiCall('users/search/public', 'get', {
                        portal_id: this.apiConfig.portalId,
                        limit: realtorsIds.length,
                        ids: realtorsIds.join(',')
                    }).subscribe((response)=>{
                        if(response.status){
                            this.store.dispatch(new SetRealtors(response.users.map(user => {
                                {
                                    return <Realtor>{
                                        id: user.account_id,
                                        bot_id: user.meta.bot_id,
                                        widgetToken: user.meta.bot_id+'widgettoken',
                                        name: user.name,
                                        meta: user.meta,
                                        role: RoleEnum.UserRole,
                                        portal:this.apiConfig.portalId,
                                        plan: user.plan
                                    }
                                }
                            })))
                            return true
                        } else {
                            return false
                        }
                    })
                }
            })
    }

    public subscribePlanConfirm(planId, stripeToken){
        return this.apiCall('subscription-plan/'+planId+'/subscribe', 'post', {
            token: stripeToken
        }).toPromise()
    }

    public uploadFile(botId, file, name){
        const formData: FormData = new FormData();
        const headers = new HttpHeaders()
        const type = file.type.split('/')[0] === 'image' ? 'image' : 'file';
        headers.append('Content-Type', 'multipart/form-data')
        formData.append('fileKey', file, name);
        return this.apiCall('attachment/' + type + '/' + botId, 'post', formData, { headers: headers}).toPromise()
    }

    public deleteMarker(marker) {
        return this.apiCall('product/' + marker.id, 'delete').toPromise()
    }

    public sendContactForm(email, message){
        const data = {
            email,
            message,
            template: "contact_reply",
            source: "contact"
        };
        const headers = new HttpHeaders({'Portal-ID': this.apiConfig.portalId})
        return this.apiCall('contact', 'post', data, { headers })
    }

    private _findBot(bots:any[]){
        return bots.find(bot => {
            return bot.portal_id === this.apiConfig.portalId
        })
    }

    private _findConnection(connections:any[]){
        return connections.find(connection => {
            return connection.provider == 'widget'
        })
    }
}
