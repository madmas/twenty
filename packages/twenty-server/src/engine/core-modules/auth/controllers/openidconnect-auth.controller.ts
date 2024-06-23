import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';

import { Response } from 'express';

import { TypeORMService } from 'src/database/typeorm/typeorm.service';
import { OpenIdConnectAuthGuard } from 'src/engine/core-modules/auth/guards/openidconnect.guard';
import { AuthService } from 'src/engine/core-modules/auth/services/auth.service';
import { TokenService } from 'src/engine/core-modules/auth/services/token.service';
import { MicrosoftRequest } from 'src/engine/core-modules/auth/strategies/microsoft.auth.strategy';
import { OpenIdConnectProviderEnabledGuard } from 'src/engine/core-modules/auth/guards/openidconect-provider-enabled.guard';

@Controller('auth/openidconnect')
export class OpenIDConnectAuthController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly typeORMService: TypeORMService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(OpenIdConnectProviderEnabledGuard, OpenIdConnectAuthGuard)
  async auth() {
    console.log('OpenIdConnectAuthController auth()');

    // As this method is protected by Microsoft Auth guard, it will trigger Microsoft SSO flow
    return;
  }

  @Get('redirect')
  @UseGuards(OpenIdConnectProviderEnabledGuard, OpenIdConnectAuthGuard)
  async authRedirect(
    @Req() req: MicrosoftRequest,
    @Res() res: Response,
  ) {
    console.log('OpenIdConnectAuthController authRedirect()');

    const { firstName, lastName, email, picture, workspaceInviteHash } =
      req.user;

    const user = await this.authService.signInUp({
      email,
      firstName,
      lastName,
      picture,
      workspaceInviteHash,
      fromSSO: true,
    });

    const loginToken = await this.tokenService.generateLoginToken(user.email);

    return res.redirect(this.tokenService.computeRedirectURI(loginToken.token));
  }
}
