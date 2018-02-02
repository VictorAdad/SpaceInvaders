export const environment = {
  production: true,
  api : {
    host : 'http://10.0.30.14:9001',
    ws : 'ws://10.0.30.14:9001',
  },
  app: {
    host: 'http://10.0.30.14/sigi'
  },
  oam: {
    tokenApp: 'b2F1dGhzaWdpY2xpZW50OmZjODFmZGFmNjlhYjQ4NjZhMmZjODU3NWMwZGIwYmQ2',
    domainName: 'OAuthSIGIDomain',
    grantType: 'PASSWORD',
    scope: 'AttributesOUD.attrs',
    host: 'http://sigi-api.evomatik.net',
    session: '_USER',
    idle: 240,
    idleTimeout: 60
  }
};
