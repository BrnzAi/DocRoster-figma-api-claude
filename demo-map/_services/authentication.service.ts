import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { IAppState } from '@/_store/app.state'

import { Realtor } from '@/_models/realtor.model';
import { Meta } from '@/_models/meta.model';
import { PricingPlan } from '@/_models/pricing-plan.model';
import { ConfigService } from '@/_services/config.service';
import { ApiService } from '@/_services/api.service';
import { SetCurrentUser, ClearCurrentUser } from '@/_store/actions/currentuser.actions';

import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<Realtor>
    public currentUser: Observable<Realtor>
    public apiConfig: any

    constructor(private http: HttpClient, private api: ApiService, private store: Store<IAppState>) {
        this.currentUserSubject = new BehaviorSubject<Realtor>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.apiConfig = ConfigService.Settings.api;
    }

    public get currentUserValue(): Realtor {
        return this.currentUserSubject.value;
    }

    public login(email, password) {
        return this.http.post<any>(this.apiConfig.loginUrl, {
            login: email,
            password: password
        }).pipe(map(response => {
            if(response.status){
                localStorage.setItem('access_token', response.data.access_token);
                this.me();
                return true;
            } else {
                return false;
            }
        }));
    }

    public me() {
        const token = localStorage.getItem('access_token')
        if(!token){
            this.logout()
            return false
        }
        this.http.get<any>(this.apiConfig.apiUrl+'user/me?access_token='+token).subscribe((response)=> {
            if(response.status){
                const user: Realtor = this._mapUser(response)
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.store.dispatch(new SetCurrentUser({
                    user: user,
                    token: token
                }))
                this._afterAuth()
                return true;
            } else {
                this.logout();
                return false;
            }
        },
        error => {
            this.logout();
            return false;
        });
    }

    public newMe(token) {
        if(!token){
            this.logout()
            return false
        }
        this.http.get<any>(this.apiConfig.apiUrl+'user/me?access_token='+token).subscribe((response)=> {
                if(response.status){
                    const user: Realtor = this._mapUser(response)
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('access_token', token);
                    this.store.dispatch(new SetCurrentUser({
                        user: user,
                        token: token
                    }))
                    this._afterAuth()
                    return true;
                } else {
                    this.logout();
                    return false;
                }
            },
            error => {
                this.logout();
                return false;
            });
    }

    public refreshMe() {
        const token = localStorage.getItem('access_token')
        if(!token){
            this.logout()
            return false
        }
        this.http.get<any>(this.apiConfig.apiUrl+'user/me?access_token='+token).subscribe((response)=> {
            if(response.status){
                const user: Realtor = this._mapUser(response)
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.store.dispatch(new SetCurrentUser({
                    user: user,
                    token: token
                }))
                return true;
            } else {
                this.logout();
                return false;
            }
        },
        error => {
            this.logout();
            return false;
        });
    }

    public register(email, password, firstname, lastname, meta) {
        return this.http.post<any>(this.apiConfig.registerUrl,{
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname,
            portal: "realtystreetleads",
            group_id: 64,
            meta: meta
        }).pipe(map(response => {
            if(response.status){
                const user: Realtor = this._mapUser(response.data)
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('access_token', response.data.access_token);
                this.store.dispatch(new SetCurrentUser({
                    user: user,
                    token: response.data.access_token
                }))

                user.meta.bot_id = response.data.default_bots[0]
                this.update(user.name, user.meta).pipe(first())
                    .subscribe(
                        data => {
                            this._afterAuth()
                            return true
                        },
                        error => {
                            this._afterAuth()
                            return true
                        })
                this.currentUserSubject.next(user);
                return user
            } else {
                return false;
            }
        }));
    }

    public update(name, meta) {
        return this.http.put<any>(this.apiConfig.apiUrl + 'user/' + JSON.parse(localStorage.getItem('currentUser')).id,{
            name: name,
            meta: meta,
            access_token: localStorage.getItem('access_token')
        }).pipe(map(response => {
            if(response.status){
                this.refreshMe()
                return true;
            } else {
                return false;
            }
        }));
    }

    public logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        this.store.dispatch(new ClearCurrentUser())
        this.currentUserSubject.next(null);
    }

    private _afterAuth() {
        this.api.getBot()
    }

    private _mapUser(userData:any):Realtor{
        const user: Realtor = {
            id: 'account_id' in userData ? userData.account_id : userData.id,
            name: 'name' in userData ? userData.name : userData.first_name,
            email: userData.email,
            nickname: null,
            role: userData.role,
            portal: 'portal' in userData ? userData.portal.portal_id : userData.portal_id,
            plan: <PricingPlan> userData.plan,
            meta: <Meta>{
                companyname: userData.meta.companyname,
                website: userData.meta.website,
                zoom: userData.meta.zoom,
                buyer_agent: userData.meta.buyer_agent,
                realtor: userData.meta.realtor,
                experience:  userData.meta.experience,
                aboutcompany: userData.meta.aboutcompany,
                avatar: userData.meta.avatar ? userData.meta.avatar : 'https://api.brn.ai/img/default-client-avatar.png',
                logo: userData.meta.logo,
                bot_id: 'bot_id' in userData.meta ? userData.meta.bot_id : null,
                areas: 'areas' in userData.meta ? userData.meta.areas : [],
                foreign_languages: 'foreign_languages' in userData.meta ? userData.meta.foreign_languages : ''
            }
        }

        if (!user.plan.products) {
            user.plan.products = {
                limit: 0,
                total: 0
            }
        }

        if (user.plan.mode === 'free' || user.plan.mode === 'subscription' && user.plan.status === 'trial') {
            user.plan.mode = 'free';
            user.plan.status = 'active';
            user.plan.products.limit = 5;
        }

        return user
    }
}
