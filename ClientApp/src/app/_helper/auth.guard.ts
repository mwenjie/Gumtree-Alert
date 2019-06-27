import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs/observable/of';
import { catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
        if(this.authService.IsLoggedIn && !this.authService.isSessionExpired) return of(true);
        var sessionKey = route.queryParams['sessionKey'];
        return this.authService.login(sessionKey).pipe(
            map(loginResponse => {
                return true;
            }),
            catchError((err) =>  {
            window.location.href = route.data['externalUrl'];
            return Observable.of(false);
            })
        )

        //catch all
        window.location.href = route.data['externalUrl'];
        return Observable.of(false);
    }

}