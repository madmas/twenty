import { BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-openidconnect';
import { Request } from 'express';
import { VerifyCallback } from 'passport-google-oauth20';

import { EnvironmentService } from 'src/engine/integrations/environment/environment.service';

export type MicrosoftRequest = Omit<
  Request,
  'user' | 'workspace' | 'cacheVersion'
> & {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    picture: string | null;
    workspaceInviteHash?: string;
  };
};

export class OpenIdConnectAuthStrategy extends PassportStrategy(
  Strategy,
  'openidconnect',
) {
  constructor(environmentService: EnvironmentService) {
    super({
      issuer: 'https://server.example.com',
      authorizationURL: 'https://server.example.com/authorize',
      tokenURL: 'https://server.example.com/token',
      userInfoURL: 'https://server.example.com/userinfo',
      clientID: environmentService.get('AUTH_OPENIDCONNECT_CLIENT_ID'),
      clientSecret: environmentService.get('AUTH_OPENIDCONNECT_CLIENT_SECRET'),
      callbackURL: environmentService.get('AUTH_OPENIDCONNECT_CALLBACK_URL'),
    });
    console.log('OpenIdConnectAuthStrategy constructor');
  }

  authenticate(req: any, options: any) {
    console.log('OpenIdConnectAuthStrategy authenticate');

    options = {
      ...options,
      state: JSON.stringify({
        workspaceInviteHash: req.params.workspaceInviteHash,
      }),
    };

    return super.authenticate(req, options);
  }

  async validate(
    request: MicrosoftRequest,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    console.log('OpenIdConnectAuthStrategy validate');

    const { name, emails, photos } = profile;

    const state =
      typeof request.query.state === 'string'
        ? JSON.parse(request.query.state)
        : undefined;

    const email = emails?.[0]?.value ?? null;

    if (!email) {
      throw new BadRequestException('No email found in your Microsoft profile');
    }

    const user: MicrosoftRequest['user'] = {
      email,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos?.[0]?.value,
      workspaceInviteHash: state.workspaceInviteHash,
    };

    done(null, user);
  }
}
