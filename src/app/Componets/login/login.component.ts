import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import validateForm from 'src/app/Helper/validateform';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  type:string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService
    ) {} //injetar o servico auth

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.auth.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          this.loginForm.reset();
          if (res && res.token) {
            this.auth.storeToken(res.AccessToken);
            const tokenPayload = this.auth.decodeToken();
            this.userStore.setFullNameForStore(tokenPayload.name);
            this.userStore.setRoleForStore(tokenPayload.role);

            console.log('Token generated:', res.token);

            // Redirecionar apenas se o login for bem-sucedido e o token for armazenado
            this.router.navigate(['dashboard']);
            this.toast.success({ detail: 'SUCCESS', summary: res.message, duration: 5000 });
          } else {
            this.toast.error({ detail: 'ERROR', summary: 'Token not generated', sticky: true });
          }
        },
        error: (err) => {
          this.toast.error({ detail: 'ERROR', summary: 'Form is Invalid', sticky: true });
        }
      });
    } else {
      validateForm.validateAllFormFileds(this.loginForm);
      alert('Your form is invalid');
    }
  }
}
