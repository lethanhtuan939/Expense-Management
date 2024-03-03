import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onLogin(): void {
    const data = this.loginForm.value;

    this.authService.login(data).subscribe(
      (result) => {
        if (result) {
          this.router.navigate(['']);
        } else {
          this.isError = true;
          this.toastr.warning('Warning!', 'Email or password is invalid!');
        }
      },
      (error) => {
        console.error('Error logging in: ', error);
        this.isError = true;
      }
    );
  }
}
