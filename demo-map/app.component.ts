import { Component, ViewEncapsulation, ElementRef, OnInit  } from '@angular/core';
import { AuthenticationService } from '@/_services/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { IAppState } from '@/_store/app.state'
import { GetAccessToken, IsAuthorised } from '@/_store/selectors/currentuser.selector'
import { ConfigService } from '@/_services/config.service';

@Component({
    selector: '[rsl-root]',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    public activeTab: string = 'home';
    public activeLink: string = 'home';
    public showMenu: boolean = true;
    public showMobileMenu: boolean = false;
    public title: string = 'realtystreet';
    public mapHeight: number = 0;
    public showSpace = true
    public currentUser = null
    
    public isAuthorised = false

    public iframeUrl
    private token: string = ''

    public paymentConfig: any

//    @ViewChild('rslFooter',{ read: true, static: false }) rslFooter: ElementRef;
    
    constructor(
        private rslFooter: ElementRef,
        private authenticationService: AuthenticationService,
        private store: Store<IAppState>,
        private activatedRoute: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) {
        this.token = localStorage.getItem('access_token')

        this.paymentConfig = ConfigService.Settings.pricing

        this.authenticationService.me()
        this.store.select(IsAuthorised).pipe()
            .subscribe(
                data => {
                    this.isAuthorised = data

                    if (this.isAuthorised) {
                        if (this.activeTab == 'register') {
                            this.activeTab = 'map'
                        }
                        if (this.activeLink == 'register') {
                            this.activeLink = 'map'
                        }
                    }
                },
                error => {
                    this.isAuthorised = false
                });

        const subscription = this.store.select(GetAccessToken).subscribe(token => {
            if(this.token !== token){
                this.token = token

                if (token) {
                    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://app.realtystreetleads.com/external?token=' + this.token);
                }
            }
        })

        // Log in by external token
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['external_token']) {
                subscription.unsubscribe()

                this.token = params['external_token']
                this.authenticationService.newMe(params['external_token'])
            }

            if (params['action'] && params['action'] == 'register') {
                subscription.unsubscribe()

                if (!this.isAuthorised) {
                    this.activeTab = 'register'
                    this.activeLink = 'register'
                }
            }
        });
    }
    
    ngOnInit() {}
    
    public switchTab(link) {
        const target: string = (link == 'search' ? 'map' : link)

        if (this.activeTab !== target) {
            this.activeTab = target
            this.activeLink = link
            this.showMobileMenu = false
        } else {
            this.activeLink = link
        }
    }
    
    public switchMenu(onoff:boolean) {
        if(this.isMobile()){
            this.showMobileMenu = onoff
        } else {
            this.showMenu = onoff
        }
    }
    
    public isMobile(){
        return !window.matchMedia('(min-width: 992px)').matches
    }
    
    ngAfterViewInit() {
//        console.log(this.rslFooter.nativeElement.offsetHeight)
    }
}
