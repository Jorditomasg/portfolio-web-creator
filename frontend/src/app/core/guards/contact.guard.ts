import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContentService } from '../services/content.service';

export const contactGuard: CanActivateFn = () => {
  const contentService = inject(ContentService);
  const router = inject(Router);
  
  const settings = contentService.settings();
  
  // If settings not loaded yet or contact enabled, allow access
  if (!settings || settings.enable_contact_form) {
    return true;
  }
  
  // Redirect to home if contact is disabled
  return router.createUrlTree(['/']);
};

