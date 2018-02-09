export const environment = {
    production: true,
    api : {
    host : 'https://sigi.evomatik.net/backend',
    ws : 'wss://sigi.evomatik.net/ws'
},
app: {
    host: 'https://sigi.evomatik.net/sigi-test'
},
oam: {
    tokenApp: 'b2F1dGhzaWdpY2xpZW50OmZjODFmZGFmNjlhYjQ4NjZhMmZjODU3NWMwZGIwYmQ2',
    domainName: 'OAuthSIGIDomain',
    grantType: 'PASSWORD',
    scope: 'AttributesOUD.attrs',
    host: 'https://sigi.evomatik.net/oam',
    session: '_USER',
    idle: 4800, // segundos - 80min
    idleTimeout: 600 // Segundos 10min
}
};
