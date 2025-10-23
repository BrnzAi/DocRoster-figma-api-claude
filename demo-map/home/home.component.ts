import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rsl-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  @Output() tabSwitch: EventEmitter<string> = new EventEmitter<string>()

  public navigateTo(target:string){
    this.tabSwitch.emit(target)
  }

  ngOnInit() {
  }

}
