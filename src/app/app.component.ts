import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'abc-labs-icbt';
  isLoggedIn: boolean = false;

  loggedInEmiited(){
    this.isLoggedIn = true;
  }

}
