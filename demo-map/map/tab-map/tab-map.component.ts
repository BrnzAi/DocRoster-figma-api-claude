import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Input, Renderer2, Inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from '@/_store/app.state'
import { GetVisibleRealtors, GetActiveRealtor } from '@/_store/selectors/realtors.selector';
import { Realtor } from '@/_models/realtor.model'
import { SetActiveRealtor, ClearActiveRealtor } from '@/_store/actions/realtors.actions';
import { RealtorComponent } from './realtor/realtor.component';
import { Marker } from "@/_models/marker.model";
import {GetActiveMarker} from "@/_store/selectors/markers.selector";
import {ClearActiveMarker} from "@/_store/actions/markers.actions";

@Component({
    selector: '[rsl-tab-map]',
    templateUrl: './tab-map.component.html',
    styleUrls: ['./tab-map.component.css']
})
export class TabMapComponent implements OnInit {
    @Input() public isActive: boolean = false
    public isHovered:boolean = false
    public mapRealtors: Realtor[]
    public activeRealtor: Realtor
    public activeMarker: Marker
    public exampleChatVisible: boolean = false
    public disableButtonDown: boolean = true
    public disableButtonUp: boolean = true
    public showScrollPanel: boolean = false
    public showMovingScrollPanel: boolean = false
    public widget: any
    public isTooltipOpened = false
    public showFlyer = true
    @ViewChild('realtorsContainer', {static: false}) realtorsContainer: ElementRef
    @ViewChild('scrollContainer', {static: false}) scrollContainer: ElementRef
    @ViewChildren(RealtorComponent) rslRealtors: QueryList<any>
    @ViewChild('chatcontainer',{ static: false }) chatContainer: ElementRef

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private store: Store<IAppState>,
        private renderer: Renderer2
    ) {
        this.store.pipe(select(GetActiveRealtor))
            .subscribe(realtor => {
                this.activeRealtor = realtor

                if (this.rslRealtors && realtor) {
                    this.document.body.classList.add('modal-open')

                    setTimeout(() => {
                        let rslRealtor = this.rslRealtors.find(function(r) {
                            return r.realtor.id === realtor.id
                        })

                        // Move active realtor top
                        if (rslRealtor) {
                            let wrapperPos = Math.round(rslRealtor.nativeElement.getBoundingClientRect().top) + parseInt(window.getComputedStyle(rslRealtor.nativeElement).paddingTop),
                                realtorsPos = Math.round(this.realtorsContainer.nativeElement.getBoundingClientRect().top) + parseInt(window.getComputedStyle(this.realtorsContainer.nativeElement).marginTop),
                                delta = realtorsPos - wrapperPos

                            if (delta) {
                                this.scrollContainer.nativeElement.style.marginTop = '' + (parseInt(window.getComputedStyle(this.scrollContainer.nativeElement).marginTop) + delta) + 'px'
                            }
                        }
                    }, 0)
                } else {
                    this.document.body.classList.remove('modal-open')
                }
            })
        this.store.pipe(select(GetActiveMarker))
            .subscribe(marker => {
                this.showFlyer = true
                this.activeMarker = marker
            })
    }

    public activatePrev() {
        if (this.activeRealtor) {
            const indexPrev = this.mapRealtors.indexOf(this.activeRealtor) - 1;

            if (indexPrev >= 0) {
                this.store.dispatch(new ClearActiveRealtor())
                this.store.dispatch(new ClearActiveMarker())
                setTimeout(() => {
                    this.store.dispatch(new SetActiveRealtor(this.mapRealtors[indexPrev].id))
                }, 0)
            }
        }

        return false
    }

    public activateNext() {
        if (this.activeRealtor) {
            const indexNext = this.mapRealtors.indexOf(this.activeRealtor) + 1;

            if (indexNext < this.mapRealtors.length) {
                this.store.dispatch(new ClearActiveRealtor())
                this.store.dispatch(new ClearActiveMarker())
                setTimeout(() => {
                    this.store.dispatch(new SetActiveRealtor(this.mapRealtors[indexNext].id))
                }, 0)
            }
        }

        return false
    }

    public showButtonPrev(): boolean {
        if (this.activeRealtor) {
            const indexPrev = this.mapRealtors.indexOf(this.activeRealtor) - 1;

            if (indexPrev >= 0) {
                return true
            }
        }

        return false
    }

    public showButtonNext(): boolean {
        if (this.activeRealtor) {
            const indexNext = this.mapRealtors.indexOf(this.activeRealtor) + 1;

            if (indexNext < this.mapRealtors.length) {
                return true
            }
        }

        return false
    }

    private minStep: number = 128
    private scrollInProgress: boolean = false

    public scrollDown() {
        const scrollableHeight = this.realtorsContainer.nativeElement.getBoundingClientRect().height,
            scrollContainerTop = parseInt(window.getComputedStyle(this.scrollContainer.nativeElement).marginTop),
            step = Math.min(this.minStep, -1 * scrollContainerTop) || this.minStep

        if (!this.scrollInProgress) {
            this.scrollInProgress = true
            this.scrollContainer.nativeElement.style.marginTop = '' + (scrollContainerTop + step) + 'px'

            setTimeout(() => {
                this.scrollInProgress = false
            }, 200)
        }

        return false
    }

    public scrollUp() {
        let scrollableHeight = this.realtorsContainer.nativeElement.getBoundingClientRect().height,
            scrollContainerTop = parseInt(window.getComputedStyle(this.scrollContainer.nativeElement).marginTop),
            step = this.minStep

        if (!this.scrollInProgress) {
            this.scrollInProgress = true
            this.scrollContainer.nativeElement.style.marginTop = '' + (scrollContainerTop - step) + 'px'

            setTimeout(() => {
                this.scrollInProgress = false
            }, 200)
        }

        return false
    }

    public isMobile(){
        return !window.matchMedia('(min-width: 992px)').matches
    }

    public showExampleChat() {
        this.renderer.addClass(this.document.body, 'modal-open')
        this.exampleChatVisible = true;
    }

    public hideExampleChat() {
        this.renderer.removeClass(this.document.body, 'modal-open')
        this.exampleChatVisible = false;
    }

    ngOnInit() {
        this.store.pipe(select(GetVisibleRealtors))
            .subscribe(realtors => {
                this.mapRealtors = realtors

                if (this.activeRealtor) {
                    if (!this.mapRealtors.includes(this.activeRealtor)) {
                        this.scrollContainer.nativeElement.style.marginTop = '0px'
                        this.store.dispatch(new ClearActiveRealtor())
                        this.store.dispatch(new ClearActiveMarker())
                    }
                }
            })
    }

    ngAfterViewChecked() {
        if (this.mapRealtors.length) {
            this.exampleChatVisible = false

            setTimeout(() => {
                let scrollableHeight = this.realtorsContainer.nativeElement.getBoundingClientRect().height,
                    scrollContainerHeight = this.scrollContainer.nativeElement.getBoundingClientRect().height,
                    scrollContainerTop = parseInt(window.getComputedStyle(this.scrollContainer.nativeElement).marginTop)

                if (scrollContainerTop >= scrollContainerHeight) {
                    this.scrollContainer.nativeElement.style.marginTop = '0px'
                    scrollContainerTop = 0
                }

                this.disableButtonDown = scrollContainerTop >= 0
                this.disableButtonUp = scrollableHeight >= scrollContainerHeight + scrollContainerTop
                this.showScrollPanel = !this.activeRealtor && !(this.disableButtonDown && this.disableButtonUp)
                this.showMovingScrollPanel = scrollableHeight >= scrollContainerHeight + scrollContainerTop
            })
        } else {
            setTimeout(() => {
                this.disableButtonDown = true
                this.disableButtonUp = true
                this.showScrollPanel = false
                this.showMovingScrollPanel = false

                this.scrollContainer.nativeElement.style.marginTop = '0px'
            })
        }

        if (this.isActive && !this.mapRealtors.length && this.exampleChatVisible) {
            if (!this.widget) {
                this.widget = this.renderer.createElement('chat-widget');
                this.widget.bot = '4LU0XWZF69'
                this.widget.token = '4LU0XWZF69widgettoken'
                this.widget.custom = "rslAgent"
                this.renderer.appendChild(this.chatContainer.nativeElement, this.widget)
            }
        } else {
            if (this.widget) {
                this.widget = null
            }
        }
    }

}
