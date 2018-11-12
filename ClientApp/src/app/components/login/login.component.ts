import { trigger, state, transition, style, animate} from '@angular/animations';
import { Component, OnInit} from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
 
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    animations: [
        trigger('slideInOut', [
          state('in', style({
            transform: 'translate3d(0, 0, 0)'
          })),
          state('out', style({
            transform: 'translate3d(100%, 0, 0)'
          })),
          transition('in => out', animate('400ms ease-in-out')),
          transition('out => in', animate('400ms ease-in-out'))
        ]),
      ]
})
 
export class LoginComponent implements OnInit {
    form: FormGroup;
    form2fa: FormGroup;
    model: any = {};
    loading = false;
    returnUrl: string;
    isLeftVisible = true;
    currrentUser: User;
 
    constructor(fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthService, private alertService: AlertService) {
        this.form = fb.group({
            "username": ["", [Validators.required
                , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
            "password": ["", [Validators.required
                , Validators.minLength(8)]]
        })

        this.form2fa = fb.group({
            "code": ["", [Validators.required]]
        })
    }
 
    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
 
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
 
    login() {
        this.loading = true;
        this.authenticationService.login(this.form.value.username, this.form.value.password)
            .subscribe(
                user => {
                    this.isLeftVisible = false;
                    this.currrentUser = user;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    get password() { return this.form.get('password'); }

    get username() { return this.form.get('username'); }

    get code() { return this.form2fa.get('code'); }

    onCodeSubmit() {
        let token = this.authenticationService.getToken(this.currrentUser.secret);
        if (token == this.code.value) {
            this.alertService.success('Login successful', true);
            this.router.navigate(['/']);
        }
    }
}