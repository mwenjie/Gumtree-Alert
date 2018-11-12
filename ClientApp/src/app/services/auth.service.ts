import { Injectable, Injector} from '@angular/core';
import { Observable, Subject} from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { authenticator } from 'otplib/otplib-browser';
import { pipe } from '../../../node_modules/@angular/core/src/render3/pipe';

@Injectable()
export class AuthService {
    private _IsLoggedin = new Subject<boolean>();

    constructor(protected http: HttpClient, injector: Injector) {
    }

    getQr(): Observable<HttpResponse<string>> {
        return this.http.get<string>('/api/qr', { observe: 'response' });
    }

    login(username: string, password: string) {
        return this.http.post<any>('/api/authenticate', { username: username, password: password }).pipe(
            map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                this._IsLoggedin.next(true);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this._IsLoggedin.next(false);
    }

  get currentUser(): User {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    return user;
  }

  get IsLoggedIn(): Observable<boolean>{
      return this._IsLoggedin.asObservable();
  }

  getToken(secret: string): string{
    return authenticator.generate(secret);
  }
  
  getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    let currentUser = this.currentUser;
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + currentUser.token,
      'Content-Type': 'application/json',
    });

    return { headers: headers };
  }

}