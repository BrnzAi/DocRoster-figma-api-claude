import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';
import { ConfigService } from '@/_services/config.service';
import { ApiService } from '@/_services/api.service';
import { AuthenticationService } from '@/_services/authentication.service';
import { PricingPlan } from '@/_models/pricing-plan.model'
import { select, Store } from '@ngrx/store';
import { IAppState } from '@/_store/app.state'
import { GetCurrentUser, IsAuthorised } from '@/_store/selectors/currentuser.selector'
import { first } from 'rxjs/operators';

@Component({
    selector: '[rsl-tab-pricing]',
    templateUrl: './tab-pricing.component.html',
    styleUrls: ['./tab-pricing.component.css']
})
export class TabPricingComponent implements OnInit {
    @Output() toPlacead: EventEmitter<string> = new EventEmitter<string>()
    @Output() toRegister: EventEmitter<string> = new EventEmitter<string>()
    public activeSlide:number = 1
    private stripeCheckoutHandler: StripeCheckoutHandler
    public paymentConfig: any
    public currentPlan: PricingPlan
    private _switcherProfessional: string = ''
    private _switcherPlatinum: string = ''
    constructor(
        private stripeCheckoutLoader: StripeCheckoutLoader,
        private authenticationService: AuthenticationService,
        private apiService: ApiService,
        private store: Store<IAppState>
    ) {
        this.paymentConfig = ConfigService.Settings.pricing
        this.store.select(GetCurrentUser).subscribe(user => {
            if(user){
                this.currentPlan = user.plan
            }
        })
        this.store.select(IsAuthorised).subscribe(data => {
            if(!data){
                this.currentPlan = null
            }
        })
    }

    ngOnInit() { }

    public ngAfterViewInit() {
        this.stripeCheckoutLoader.createHandler({
            key: this.paymentConfig.stripeKey
        }).then((handler: StripeCheckoutHandler) => {
            this.stripeCheckoutHandler = handler;
        });
    }

    get showFreePlan() {
        return true;
    }

    public prevSlide() {
        const slidesCount = this.showFreePlan ? 3 : 2
        this.activeSlide = (this.activeSlide <= 1) ? slidesCount : this.activeSlide - 1
    }

    public nextSlide() {
        const slidesCount = this.showFreePlan ? 3 : 2
        this.activeSlide = (this.activeSlide >= slidesCount)? 1 : this.activeSlide + 1
    }

    get switcherProfessional() {
        if (this._switcherProfessional.length) {
            return this._switcherProfessional
        }
        if (this.currentPlan && this.currentPlan.status == 'active' && this.paymentConfig.plans.professional.id == this.currentPlan.id) {
            return 'year'
        }
        return 'month'
    }

    set switcherProfessional(val:string) {
        this._switcherProfessional = val
    }

    get switcherPlatinum() {
        if (this._switcherPlatinum.length) {
            return this._switcherPlatinum
        }
        if (this.currentPlan && this.currentPlan.status == 'active' && this.paymentConfig.plans.ultimate.id == this.currentPlan.id) {
            return 'year'
        }
        return 'month'
    }

    set switcherPlatinum(val:string) {
        this._switcherPlatinum = val
    }

    public checkoutClick(plan:string){
        if (this.currentPlan) {
            const selectedPlan = this.paymentConfig.plans[plan]
            if (selectedPlan.id == this.currentPlan.id){
                return false;
            }

            let checkout;
            if (plan === 'free') {
                checkout = confirm('Your Credit Card will NOT be charged for this FREE yearly membership, but we will need credit card information on file for membership renewal January, 2021 (Professional Plan at $299).');
            } else {
                checkout = true;
            }

            if (checkout) {
                this.stripeCheckoutHandler.open({
                    amount: selectedPlan.price*100,
                    currency: 'USD',
                    image: 'https://realtystreetleads.com/assets/images/LOGO.png',
                    name: 'Realty Street Leads',
                    description: `"${selectedPlan.name}" plan subscription for ${selectedPlan.interval}`,
                    panelLabel: 'Subscribe',
                }).then((token) => {
                    this.apiService.subscribePlanConfirm(selectedPlan.id, token).then(response => {
                        if (response.status){
                            this.authenticationService.me()

                            alert('Your subscription has been registered and will be activated shortly.');

                            const subscription = this.store.select(GetCurrentUser).subscribe(user => {
                                if(user && user.plan.status=='active'){
                                    setTimeout(() => {
                                        subscription.unsubscribe()

                                        this.apiService.makeConnection()
                                    })

                                    this.toPlacead.emit()
                                }

                                this.authenticationService.refreshMe()
                            })
                        }
                    })
                }).catch((err) => {
                    // Payment failed or was canceled by user...
                    if (err !== 'stripe_closed') {
                        throw err;
                    }
                });
            }
        } else {
            this.toRegister.emit()
        }
    }
}
