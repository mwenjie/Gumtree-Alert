import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { authenticator } from 'otplib/otplib-browser';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        let secretKey: string = JSON.parse(localStorage.getItem('secretKey')) || null;
        let notifications: any[] = JSON.parse(localStorage.getItem('notifications')) || [];

        // wrap in delayed observable to simulate server api call
        return Observable.of(null).mergeMap(() => {
            if (request.url.endsWith('/api/notification') && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    let tempNotifications = notifications.length ? notifications : null;

                    return Observable.of(new HttpResponse({ status: 200, body: tempNotifications }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }
            //upsert notification
            if (request.url.endsWith('/api/notification') && request.method === 'POST') {
                // get new user object from post body
                let newNotification = request.body;

                if (newNotification.id == null) {
                    // save new user
                    newNotification.id = notifications.length + 1;
                    notifications.push(newNotification);
                    localStorage.setItem('notifications', JSON.stringify(notifications));

                    // respond 200 OK
                    return Observable.of(new HttpResponse({ status: 200 }));
                }
                else {
                    let idx = notifications.findIndex(item => item.id === newNotification.id);
                    if (idx >= 0) {
                        notifications[idx].subject = newNotification.subject;
                        notifications[idx].url = newNotification.url;
                        notifications[idx].email = newNotification.email;
                        notifications[idx].frequency = newNotification.frequency;
                        notifications[idx].min = newNotification.min;
                        notifications[idx].max = newNotification.max;
                        localStorage.setItem('notifications', JSON.stringify(notifications));
                        return Observable.of(new HttpResponse({ status: 200 }));
                    }
                }
            }

             // delete notification
             if (request.url.match(/\/api\/notification\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < notifications.length; i++) {
                        let notification = notifications[i];
                        if (notification.id === id) {
                            // delete user
                            notifications.splice(i, 1);
                            localStorage.setItem('notifications', JSON.stringify(notifications));
                            break;
                        }
                    }

                    // respond 200 OK
                    return Observable.of(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }

            //qrcode
            if (request.url.endsWith('/api/qr') && request.method === 'GET') {
                let value: string;
                if (secretKey == null) {
                    value = authenticator.generateSecret();
                    localStorage.setItem('secretKey', JSON.stringify(value));
                }
                else {
                    value = secretKey;
                }
                return Observable.of(new HttpResponse({ status: 200, body: value }));
            }

            // authenticate
            if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.email === request.body.username && user.password.pwd === request.body.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let user = filteredUsers[0];
                    let body = {
                        username: user.email,
                        token: 'fake-jwt-token',
                        secret: user.secret
                    };

                    return Observable.of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return Observable.throw('Username or password is incorrect');
                }
            }

            // get users
            if (request.url.endsWith('/api/users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return Observable.of(new HttpResponse({ status: 200, body: users }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }

            // get user by id
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = users.filter(user => { return user.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    return Observable.of(new HttpResponse({ status: 200, body: user }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }

            // create user
            if (request.url.endsWith('/api/users') && request.method === 'POST') {
                // get new user object from post body
                let newUser = request.body;

                // validation
                let duplicateUser = users.filter(user => { return user.email === newUser.email; }).length;
                if (duplicateUser) {
                    return Observable.throw('Username "' + newUser.email + '" is already taken');
                }

                // save new user
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // respond 200 OK
                return Observable.of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    return Observable.of(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return Observable.throw('Unauthorised');
                }
            }

            // pass through any requests not handled above
            return next.handle(request);

        })

            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .materialize()
            .delay(500)
            .dematerialize();
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};