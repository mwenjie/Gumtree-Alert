import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { AuthService } from '../services/auth.service';
import { retry, tap, mergeMap} from 'rxjs/operators';
import {formatDate} from '@angular/common';


@Injectable()
export class NotificationService {

    constructor(protected http: HttpClient, injector: Injector, private authService: AuthService) {
    }

    getMutedAdvertisement(id: string): Observable<Advertisement[]>{
        const adverts: Advertisement[] = [
            { Id: '129203', Title: 'Intel g4560', Price: 10, Location: 'Sydney', DateListed: new Date() },
            { Id: '129203', Title: 'Intel g3960', Price: 10, Location: 'Sydney', DateListed: new Date() },
          ];
        console.log("getting advert:id is "+ id);
        return of(adverts);
    }

    saveNotification(notification: Notification) {
        return this.http.post('/api/notification', notification);
    }

    countNotification(): Observable<Notification[]> {
        return this.http.get<Notification[]>('/api/notification', this.authService.getRequestHeaders());
    }

    deleteNotification(notificationId: number) {
        let url = '/api/notification';
        let endpointUrl = `${url}/${notificationId}`;
        return this.http.delete(endpointUrl, this.authService.getRequestHeaders())
    }

    sendNotification(alert: Alert):Observable<any>{
       return this.http.post<any>('/api/alert/send', alert);
    }

    queryAdvertisement(notification: Notification):Observable<Notification> {
        return this.http.post<Notification>('/api/webscrap/query', notification).pipe(retry(3));
     }

    calculateInterval(frequency: string) {
        let tempInterval: number;
        switch (frequency) {
            case "Every hour": { tempInterval = 1 * 60 * 1000; break; } // 1s = 1000
            case "Every 4 hour": { tempInterval = 4*60 * 60 * 1000; break; }
            case "Daily": { tempInterval = 24*60 * 60 * 1000; break; }
        }
        return tempInterval;
    }

}
