import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Starter E4b8d1',
  entryPointUriPath,
  cloudIdentifier: 'gcp-au',
  env: {
    development: {
      initialProjectKey: 'aspire-practice-project',
    },
    production: {
      applicationId: 'clsuevehz0001xrfebrr88eis',
      url: 'https://d387w1fvqie7eg.cloudfront.net',
    },
  },
  oAuthScopes: {
    view: ['view_products','view_customers','view_types'],
    manage: ['manage_products','manage_customers','manage_types'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Custom Application',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
    {
      uriPath: 'customFeature',
      defaultLabel: 'Manage Custom Fields',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
