import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { Realtor } from '@/_models/realtor.model'

@Component({
    selector: '[rsl-details]',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit  {
    @Input() public activeRealtor: Realtor
    @ViewChild('chatcontainer',{ static: false }) chatContainer: ElementRef
    public realtorWidget: any
    
    constructor(private renderer: Renderer2) { }
    ngOnInit(){}
    ngOnDestroy(){
        this.activeRealtor = null
        this.realtorWidget = null
    }
    
    ngAfterViewInit() {
        this.realtorWidget = this.renderer.createElement('chat-widget');
        this.realtorWidget.bot = this.activeRealtor.bot_id
        this.realtorWidget.token = this.activeRealtor.widgetToken
        this.realtorWidget.custom = "rslAgent"
        this.renderer.appendChild(this.chatContainer.nativeElement, this.realtorWidget)
    }

}
