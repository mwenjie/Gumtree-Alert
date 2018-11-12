import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxQRCodeModule } from 'ngx-qrcode3';
import { MatDialogModule, MatFormFieldModule, MatInputModule, MatTableModule } from "@angular/material";
import { MatSelectModule} from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './components/app.component';
import { AlertComponent} from './components/shared/alert.component';
import { HomeComponent } from './components/home/home.component';
import { CounterComponent } from './components/counter/counter.component';
import { FetchDataComponent } from './components/fetch-data/fetch-data.component';
import { NavMenuComponent} from './components/nav-menu/nav-menu.component';
import { ConfigureAlertDialogComponent} from './components/fetch-data/config-alert.component';
import { RegisterComponent } from './components/register/register.component';
import { Add2FaComponent } from './components/register/add2fa.component';
import { SlidePanelComponent } from './components/slide-panel/slide-panel.component';
import { LoginComponent } from './components/login/login.component';

import { fakeBackendProvider } from './_helper/fake-backend';
import { AuthGuard } from './_helper/auth.guard';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';
import { NotificationService} from './services/notification.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    ConfigureAlertDialogComponent,
    RegisterComponent,
    Add2FaComponent,
    SlidePanelComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxQRCodeModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatListModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
    ])
  ],
  providers: [fakeBackendProvider, AuthService, UserService, AlertService, AuthGuard, NotificationService],
  bootstrap: [AppComponent],
  entryComponents: [ConfigureAlertDialogComponent]
})
export class AppModule { }
