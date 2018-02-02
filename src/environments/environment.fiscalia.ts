// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// Variables para ambiente productivo fiscaliaedomex.gob.mx
// Se colocan de acuerdo a los proxies solicitados a MOPEGA
// Ver archivo: https://goo.gl/4aajt2

export const environment = {
    production: true,
    api : {
      host : 'https://fgjappprod01',
      ws : 'wss://fgjappprod01'
    },
    app: {
      host: 'https://fgjohsprod01'
    },
    oam: {
      tokenApp: 'b2F1dGhzaWdpY2xpZW50OmZjODFmZGFmNjlhYjQ4NjZhMmZjODU3NWMwZGIwYmQ2',
      domainName: 'OAuthSIGIDomain',
      grantType: 'PASSWORD',
      scope: 'AttributesOUD.attrs',
      host: 'https://fgjoamprod01',
      session: '_USER',
      idle: 4800, // segundos - 80min
      idleTimeout: 600 // Segundos 10min
    }
  };
  