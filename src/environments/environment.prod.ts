export const environment = {
  production: true,
  api : {
    host : 'http://xalapa.evomatik.net:9010',
    ws : 'ws://xalapa.evomatik.net:9010',
  },
  app: {
    host: 'http://sigi.evomatik.net/sigi-test'
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
