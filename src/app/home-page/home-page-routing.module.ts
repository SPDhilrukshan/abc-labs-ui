import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbcLabsHomePageComponent } from './abc-labs-home-page/abc-labs-home-page.component';


const routes: Routes = [
  {
    path: '',
    component: AbcLabsHomePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }