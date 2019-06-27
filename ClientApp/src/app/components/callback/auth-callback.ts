import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";

@Component({
  selector: "auth-callback",
  template: `
    <div>Login Successful!</div>
  `,
  styles: [
    `
      width: 100px;
    `
  ]
})
export class AuthCallbackComponent implements OnInit {
  error: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    // check for error
    this.route.snapshot.url.forEach(r => {
      if (r.path.includes("error")) {
        this.error = true;
        return;
      }
    });

    await this.authService.completeAuthentication();
    this.router.navigate(["/"]);
  }
}
