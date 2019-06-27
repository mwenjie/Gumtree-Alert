import { Injectable, Injector } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { authenticator } from "otplib/otplib-browser";
import { LocalStoreManager } from "../services/local-store-manager.service";
import { UserManager, UserManagerSettings, User } from "oidc-client";

@Injectable()
export class AuthService {
  private manager = new UserManager(getClientSettings());
  private _user: User | null;

  constructor(
    protected http: HttpClient,
    injector: Injector,
    private localStorage: LocalStoreManager
  ) {}

  async user_login() {
    return this.manager.signinRedirect();
  }

  async completeAuthentication() {
    this._user = await this.manager.signinRedirectCallback();
    this.processSessionData(this._user);
  }

  login(sessionKey: string): Observable<SessionData> {
    return this.http
      .get("http://localhost:52458/connect/session/" + sessionKey)
      .pipe(
        map(response => {
          let obj: SessionData = JSON.parse(response.toString());
          //this.processSessionData(obj);
          return obj;
        })
      );
  }

  processSessionData(user: User) {
    this.localStorage.savePermanentData(user.access_token, "access_token");
    const tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + user.expires_in);
    this.localStorage.savePermanentData(tokenExpiryDate, "expires_in");
  }

  getQr(): Observable<HttpResponse<string>> {
    return this.http.get<string>("/api/qr", { observe: "response" });
  }

  get user() {
    return this._user;
  }

  get currentUser() {
    const user = this.localStorage.getData("currentUser");
    return user;
  }

  get IsLoggedIn(): boolean {
    return this._user != null;
  }

  getToken(secret: string): string {
    return authenticator.generate(secret);
  }

  getRequestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    let currentUser = this.currentUser;
    let headers = new HttpHeaders({
      Authorization: "Bearer " + currentUser.token,
      "Content-Type": "application/json"
    });

    return { headers: headers };
  }

  get accessTokenExpiryDate(): Date {
    return this.localStorage.getDataObject<Date>("expires_in", true);
  }

  get isSessionExpired(): boolean {
    if (this.accessTokenExpiryDate == null) {
      return true;
    }

    return !(this.accessTokenExpiryDate.valueOf() > new Date().valueOf());
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: "http://localhost:5000",
    client_id: "WebMonitoring",
    redirect_uri: "http://localhost:1337/auth-callback",
    post_logout_redirect_uri: "http://localhost:1337/",
    response_type: "code",
    scope: "openid profile api2.full_access",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: "http://localhost:1337/silent-refresh.html"
  };
}
