import { gql } from '@apollo/client';

export const GET_CLIENT_CONFIG = gql`
  query GetClientConfig {
    clientConfig {
      authProviders {
        google
        password
        microsoft
        openidconnect
      }
      billing {
        isBillingEnabled
        billingUrl
        billingFreeTrialDurationInDays
      }
      signInPrefilled
      signUpDisabled
      debugMode
      telemetry {
        enabled
      }
      support {
        supportDriver
        supportFrontChatId
      }
      sentry {
        dsn
        environment
        release
      }
      captcha {
        provider
        siteKey
      }
      chromeExtensionId
    }
  }
`;
