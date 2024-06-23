import { Injectable, CanActivate, NotFoundException } from '@nestjs/common';

import { Observable } from 'rxjs';

import { EnvironmentService } from 'src/engine/integrations/environment/environment.service';
import { OpenIdConnectAuthStrategy } from 'src/engine/core-modules/auth/strategies/openidconnect.auth.strategy';

@Injectable()
export class OpenIdConnectProviderEnabledGuard implements CanActivate {
  constructor(private readonly environmentService: EnvironmentService) {}

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    console.log('OpenIdConnectProviderEnabledGuard.canActivate called');
    if (!this.environmentService.get('AUTH_OPENIDCONNECT_ENABLED')) {
      throw new NotFoundException('OpenIdConnect auth is not enabled');
    }

    new OpenIdConnectAuthStrategy(this.environmentService);

    console.log('OpenIdConnectProviderEnabledGuard.canActivate return true');

    return true;
  }
}
