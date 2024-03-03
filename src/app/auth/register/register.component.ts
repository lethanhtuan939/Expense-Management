import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm !: FormGroup;
  isError: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      repassword: ['', [Validators.required, Validators.minLength(3)]]
    }, { validators: this.passwordMatchValidator })
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const repassword = control.get('repassword');

    if (!password || !repassword) {
      return null;
    }

    return password.value === repassword.value ? null : { 'passwordMismatch': true };
  }

  onRegister(): void {
    const data = this.registerForm.value;
    const user: User = {
      email: data.email,
      password: data.password
    };

    this.authService.register(user).subscribe(
      (result) => {
        if (result) {
          this.router.navigate(['/auth/login'])
        } else {
          this.isError = true;
        }
      },
      (error) => {
        console.error('Error logging in: ', error);
        this.isError = true;
      }
    )
  }
}
