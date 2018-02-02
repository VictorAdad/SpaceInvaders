// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api : {
    host : 'http://localhost:9000',
    ws : 'ws://localhost:9000',
  },
  app: {
  	host: 'http://localhost:4200'
  },
  oam: {
  	tokenApp: 'b2F1dGhzaWdpY2xpZW50OmZjODFmZGFmNjlhYjQ4NjZhMmZjODU3NWMwZGIwYmQ2',
  	domainName: 'OAuthSIGIDomain',
  	grantType: 'PASSWORD',
  	scope: 'AttributesOUD.attrs',
  	host: 'https://sigi.evomatik.net/oam',
    session: '_USER',
    idle: 10000,
    idleTimeout: 1000
  }
};
