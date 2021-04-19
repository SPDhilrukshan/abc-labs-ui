import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-abc-labs-home-page',
  templateUrl: './abc-labs-home-page.component.html',
  styleUrls: ['./abc-labs-home-page.component.scss']
})
export class AbcLabsHomePageComponent implements OnInit {

  
  opened: boolean = false;
  tabName: string = "WELCOME"
  userType: string;
  constructor() { }

  ngOnInit() {
    this.userType = localStorage.getItem('loggedUserType');
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }

  openSideBar() {
    this.opened = true;
  }

  tabClicked(tabName:string){
    this.tabName = tabName;
  }
}
