import { register } from 'swiper/element/bundle';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth-service';
import { Router } from '@angular/router';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fb = inject(FormBuilder)
  authService = inject(AuthService)
  router = inject(Router)
  isLoading = signal<boolean>(false);

  registerForm: FormGroup = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    rePassword: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    phone: ["", [Validators.required, Validators.pattern(/^(010|011|012|015)[0-9]{8}$/)]]
  })

  submitForm() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.router.navigate(['/login'])
        },
        error: (err) => {
          this.isLoading.set(false);
          console.log(err);
        }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}