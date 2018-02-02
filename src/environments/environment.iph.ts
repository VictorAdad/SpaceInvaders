export const environment = {
    production: true,
    api : {
      host : 'https://sigi.evomatik.net/backend',
      ws : 'wss://sigi.evomatik.net/ws',
    },
    app: {
      host: 'https://sigi.evomatik.net/iph'
    },
    oam: {
      tokenApp: 'b2F1dGhzaWdpY2xpZW50OmZjODFmZGFmNjlhYjQ4NjZhMmZjODU3NWMwZGIwYmQ2',
      domainName: 'OAuthSIGIDomain',
      grantType: 'PASSWORD',
      scope: 'AttributesOUD.attrs',
      host: 'https://sigi.evomatik.net/oam',
      session: '_USER',
      idle: 240,
      idleTimeout: 60
    }
  };
  