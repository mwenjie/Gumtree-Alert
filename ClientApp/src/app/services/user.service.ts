import { Injectable, Injector} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

    constructor(protected http: HttpClient, injector: Injector) {
    }

   create(user:User){
       return this.http.post('/api/users', user);
   }

   update(user: User) {
    return this.http.put('/api/users/' + user.email, user);
   }


}