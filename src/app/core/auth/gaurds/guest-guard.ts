import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
   const router = inject(Router)
  const id = inject(PLATFORM_ID)
  
  if (isPlatformBrowser(id)) {
    if (!localStorage.getItem("userToken")) {
      return true;
    } else {
      return router.parseUrl("/")
    }
  } else {
    return true
  }
};
