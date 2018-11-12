import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  isUserLoggedIn: boolean;
  isInLoginPage: boolean;

  constructor(private authService: AuthService){
  }

  ngOnInit(){
    this.authService.IsLoggedIn.subscribe(status => this.isUserLoggedIn = status);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout(){
    this.authService.logout();
  }
}
