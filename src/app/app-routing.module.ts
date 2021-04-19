import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbcLabsHomePageComponent } from './home-page/abc-labs-home-page/abc-labs-home-page.component';
import { HomePageModule } from './home-page/home-page.module';
import { PermissionGuard } from './authenticate-logged-user.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { PermissionGuardForLogin } from './authenticate-loginpage-user.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuardForLogin],
    component: LoginPageComponent,

  },
  {
    path: "dashboard",
    //loadChildren: () => import('./home-page/home-page.module').then(m => HomePageModule)
    //component: LoginPageComponent,
    canActivate: [PermissionGuard],
    loadChildren: './home-page/home-page.module#HomePageModule'
  },
  {
    path: "login",
    canActivate: [PermissionGuardForLogin],
    component: LoginPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
