import { trigger, state, transition, style, animate} from '@angular/animations';
import { Component, OnInit} from '@angular/core'
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService} from '../../services/auth.service';
import { UserService} from '../../services/user.service';
import { AlertService} from '../../services/alert.service';
import { authenticator } from 'otplib/otplib-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-component',
  templateUrl: './register.component.html',
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
export class RegisterComponent {
  form: FormGroup;
  form2fa: FormGroup;
  isLeftVisible = true;
  secret: string;
  imageUrl: string;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  verify: string = 'false';
  token: string;

  constructor(fb: FormBuilder, private alertService: AlertService, private authService: AuthService, private userService: UserService, private router: Router) {
    this.form = fb.group({
      "email": ["", [Validators.required
        , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      "password": fb.group({
        pwd: ["", [Validators.required, Validators.minLength(8)]],
        confirmPwd: ["", [Validators.required, Validators.minLength(8)]],
      }, { validator: this.passwordConfirming })
      
    })

    this.form2fa = fb.group({
      "code": ["", [Validators.required]]
    })

  }

  get email() { return this.form.get('email'); }

  get password() { return this.form.get('password.pwd'); }

  get confirmPassword() { return this.form.get('password.confirmPwd'); }

  get code() { return this.form2fa.get('code'); }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('pwd').value !== c.get('confirmPwd').value) {
      return { invalid: true };
    }
  }

  onRegister() {
    var tempUser = <User>{};
    var secretKey = authenticator.generateSecret();

    tempUser.email = this.form.value.email;
    tempUser.password = this.form.value.password;
    tempUser.secret = secretKey;

    this.userService.create(tempUser)
      .subscribe(
        data => {
          this.alertService.clear();
          this.secret = secretKey;
          this.imageUrl = authenticator.keyuri(tempUser.email,'Myapp',secretKey);
          this.isLeftVisible = false;
        },
        error => {
          this.alertService.error(error);
        });
  }

  onCodeSubmit(){
    this.token = authenticator.generate(this.secret);
    if(this.token == this.code.value){
      this.alertService.success('Registration successful', true);
      this.router.navigate(['/']);
    }
  }


}
