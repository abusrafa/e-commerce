import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from "../../../shared/ui/loading/loading";

@Component({
  selector: 'app-addresses',
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './addresses.html',
  styleUrl: './addresses.css',
})
export class Addresses {
  private fb = inject(FormBuilder);
  
  isModalOpen = signal(false);
  isLoading = signal<boolean>(false);

  allAddresses = signal([
    {
      id: '1',
      name: 'home - 1',
      details: '1ft - 01 fgd jd',
      phone: '01111020202020',
      city: 'Tripoli'
    }
  ]);

  addressForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    details: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    city: ['', [Validators.required]]
  });

  toggleModal() {
    this.isModalOpen.update(v => !v);
    if (!this.isModalOpen()) this.addressForm.reset();
  }

  addAddress() {
    if (this.addressForm.valid) {
      this.isLoading.set(true);
      const newAddr = {
        id: Date.now().toString(),
        ...this.addressForm.value
      };
      this.allAddresses.update(prev => [...prev, newAddr]);
      this.isLoading.set(false);
      this.toggleModal();
    }
  }

  deleteAddress(id: string) {
    this.isLoading.set(true);
    this.allAddresses.update(prev => prev.filter(a => a.id !== id));
    this.isLoading.set(false);
  }
}