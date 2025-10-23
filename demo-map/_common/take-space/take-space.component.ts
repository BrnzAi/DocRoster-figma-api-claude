import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

@Component({
    selector: '[rsl-take-space]',
    templateUrl: './take-space.component.html',
    styleUrls: ['./take-space.component.css'],
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({opacity: 0, marginLeft: -349, visibility:'hidden',zIndex: 'unset'}),
                        animate('0.2s', keyframes([
                            style({ opacity: 1, marginLeft: 0, marginTop: 0, visibility:'visible', zIndex: 'unset', offset: 0.9 }),
                            style({ opacity: 1, marginLeft: 0, marginTop: 0, visibility:'visible', zIndex: 20, offset: 1 })
                        ]))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({opacity: 1, marginLeft: 0, visibility:'visible', zIndex: 20}),
                        animate('0.1s', keyframes([
                            style({ opacity: 1, marginLeft: 0, marginTop: 0, visibility:'visible', zIndex: 'unset', offset: 0.1 }),
                            style({ opacity: 0, marginLeft: -349, marginTop: 'unset', visibility:'hidden',zIndex: 'unset', offset: 1 })
                        ]))
                    ]
                )
            ]
        )
    ]
})
export class TakeSpaceComponent implements OnInit {
    @Output() noSpace: EventEmitter<string> = new EventEmitter<string>()
    @Output() toRegister: EventEmitter<string> = new EventEmitter<string>()
    public showForm:boolean = false
    
    constructor() { }

    ngOnInit() { }
    
    public toggleForm(show){
        this.showForm = show
    }
}
