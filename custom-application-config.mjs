import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'BFF Accelerator',
  entryPointUriPath,
  cloudIdentifier: 'gcp-au',
  env: {
    development: {
      initialProjectKey: 'b2c-accelerator',
    },
    production: {
      applicationId: 'clyfhv66u00152i1edszj3rb1',
      url: 'https://d8k8ri9han8jr.cloudfront.net',
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
