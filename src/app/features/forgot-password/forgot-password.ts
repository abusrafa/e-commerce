import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth-service';
import { Router } from '@angular/router';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  fb = inject(FormBuilder)
  authService = inject(AuthService)
  steps = signal<number>(1)
  router = inject(Router)
  isLoading = signal<boolean>(false);

  forgetPasswordForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]]
  })

  submitForgetPassword() {
    if (this.forgetPasswordForm.valid) {
      this.isLoading.set(true);
      this.authService.forgetPassword(this.forgetPasswordForm.value).subscribe({
        next: (res) => {
          if (res.statusMsg == "success") {
            this.steps.set(2);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        }
      })
    } else {
      this.forgetPasswordForm.markAllAsTouched()
    }
  }

  verifyResetCodeForm = this.fb.group({
    resetCode: ["", [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
  })

  submitVerifyResetCode() {
    if (this.verifyResetCodeForm.valid) {
      this.isLoading.set(true);
      this.authService.verifyResetCode(this.verifyResetCodeForm.value).subscribe({
        next: (res) => {
          if (res.status == "Success") {
            this.steps.set(3);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        }
      })
      this.verifyResetCodeForm.reset()
    } else {
      this.verifyResetCodeForm.markAllAsTouched()
    }
  }

  resetPasswordForm = this.fb.group({
    newPassword: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
  })

  submitResetPassword() {
    let body = {
      email: this.forgetPasswordForm.get("email")?.value,
      newPassword: this.resetPasswordForm.get("newPassword")?.value,
    }

    if (this.resetPasswordForm.valid) {
      this.isLoading.set(true);
      this.authService.resetPassword(body).subscribe({
        next: (res) => {
          this.steps.set(4);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        }
      })
      this.resetPasswordForm.reset()
    } else {
      this.resetPasswordForm.markAllAsTouched()
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}