/**
 * Config del servidor (Admin SDK + PIN). Solo se importa en código de servidor.
 * En Vercel, las variables de entorno tienen prioridad si existen.
 */
export const serverConfig = {
  firebaseProjectId:   'mural-bic',
  firebaseClientEmail: 'firebase-adminsdk-fbsvc@mural-bic.iam.gserviceaccount.com',
  firebasePrivateKey:  `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCz4Y9qso/zwxF1
jALEz/9EaaUgDWSN8Dd0RhPR3IzmeN45m5fmuyHJoRu5p3pWcDGEchlSsw17UsVy
SpdLaVB9oEOhSAiEp44TbASA0XOEPMMDyikdhnJY/JNYCILD1CsSWD9pJuGQAFDH
ke8/JT1X5ul5uz9yGY2XwsEd69pu//ixTMws0NEF80NkENWq90U4eQa0CGhxHcpJ
3VNEXHvX2M43fw2tJqqqRUS+K3jnNc5tSegoaS0zJbX3MzoGnTOvDzQBwyNGxMRC
bXjLz9f1ZjKz1REwbyePihcR+DjbYh6D54wZlBfEWxuDWTiSYdaK5MSIJ186oslY
87/uSIV/AgMBAAECggEAPNsmxhY7FWD9WyNPHH6yAdcsAjgFuO94E2JR+kH/eUmT
BTJapbjRqYFT++9pOC0k04Y2gwAIo5xRKGWL4ftzO80olDvmhdqZ+oAk1eAGkMpt
v655Un/V1707rCDU/KOfHsm0SkLZNPqmWZ5JrrdOlZqNip2KzXNPr/Q3mYPdlod5
qWJhtJTP9UJinDNDx0MEbBZ2moKpDvz0cuJHpwQQHtwIkeAymCaieCchD3AzZN7H
oNxkXUgPSg+8mJDOKD0OlG39/cL4Iq6eSus7hxklSFyGEmcbZzkEPOoMFtxsWx/b
J//8mkm1rN5eaSsK6uP7TqSpmNB6Oj+qYwMwyWemAQKBgQDgGjYwANYHhlBcMsYv
l+e6Ydic2Abgddr/xyO5tJe4UhgIlNggM+dRqMeCXRvEzTc0rOIUCyhtnUxUaWEq
iVoi9g9RsxbKeUrN2qRvzzOSha17GXEcAD5jqVfeNoAUPRcNAe9CgPtCm0XmB5MY
vQ76lnMQQseY9+YdXV86jSTQPwKBgQDNfAYWKB4FAZ5JQiCTM7oa2gLNJQJGbURS
VzvnIupSVkYRFB5DO+aBPxUvEUlPFX1TI8tLqpJ89oY38DkopdIofY28BffKTgWc
4eERpHudTtFCWnUp52YpHPHIhsLg3v6+1t3c8bTGTjbujLTxWXhKEwTAoaBlwANr
P1xRI1b6wQKBgQDM0sgyCaGVEQrDqdh/yWwParyrZbqrTqyR2HXrloaQ/d9fgIMk
s6u5c/SdTvJBZnsNlvGu9h/GR91qzUH0ucL7bz/DIVc0SbW3/h0K4Cs3wRw1BaTe
vc5IEo/v1oordUZrKhh/BRog33/8ZXHpS2q0V+vksdRyGClnL18JSdWaywKBgQDK
lMJfZ6+o2d6WdNYuqamJvXNTkm/6xNC9qPkKt7Zx9FJhlgb72/s1Yt7cp1sx14rV
w40yjPicsGLElVWUyF43wwhP3UZcsa0A7QP6Y8Hm5YSSuSGXbWWflMSeIJXSIqbd
uHHE2JqTgxrO9fORmdZomPVvgCjlB3eXbUDzUTb4QQKBgQDHQk7MXK9FeO1QQWIX
QnhDfSfwZdqMpr5wDJ6LFuuHrt62NTfRari9HVHYHg0JWT2aaNFBlW5wR2S+fsRE
BlClTId/EbWQLxqfVy762ma0CMae77+yUBGrcBOmxNBlOblZOHRFyGwJ5zcpKL90
pHDFUk0iksdLAMUtjVfRoQIv9A==
-----END PRIVATE KEY-----
`,
  moderatorPin: 'bic2026',
} as const;

export function getModeratorPin(): string {
  return process.env.MODERATOR_PIN ?? serverConfig.moderatorPin;
}

export function getFirebaseAdminCredentials() {
  const privateKeyRaw =
    process.env.FIREBASE_PRIVATE_KEY ?? serverConfig.firebasePrivateKey;
  return {
    projectId:   process.env.FIREBASE_PROJECT_ID   ?? serverConfig.firebaseProjectId,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? serverConfig.firebaseClientEmail,
    privateKey:  privateKeyRaw.replace(/\\n/g, '\n'),
  };
}
