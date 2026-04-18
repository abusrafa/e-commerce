import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from "../../../shared/ui/loading/loading";

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private fb = inject(FormBuilder);
  isLoading = signal<boolean>(false);

  profileForm: FormGroup = this.fb.group({
    fullName: ['Ali', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]]
  });
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  saveProfile() {
    if (this.profileForm.valid) {
      this.isLoading.set(true);
      console.log('Profile Updated:', this.profileForm.value);
      setTimeout(() => {
        this.isLoading.set(false);
      }, 500);
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.isLoading.set(true);
      console.log('Password Changed:', this.passwordForm.value);
      setTimeout(() => {
        this.isLoading.set(false);
      }, 500);
    }
  }
}