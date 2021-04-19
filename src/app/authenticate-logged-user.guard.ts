import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

    constructor( public router: Router) {


    }

    canActivate(): boolean {
        //check for token in local storage
        if(localStorage.getItem("loggedUserName")){
            
            return true;
        }else{
            this.router.navigateByUrl("login")
        }
        return false;
    }
}
