import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http'
import { AuthService } from '../services/auth.service';


@Injectable()
export class NotificationService {

    constructor(protected http: HttpClient, injector: Injector, private authService: AuthService) {
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

    sendNotification(notification: Notification):Observable<Notification> {
       return this.http.post<Notification>('/api/alert/send', notification);
    }

    calculateInterval(frequency: string) {
        let tempInterval: number;
        switch (frequency) {
            case "Every hour": { tempInterval = 60 * 60 * 1000; break; } // 1s = 1000
            case "Every 4 hour": { tempInterval = 4*60 * 60 * 1000; break; }
            case "Daily": { tempInterval = 24*60 * 60 * 1000; break; }
        }
        return tempInterval;
    }

}
