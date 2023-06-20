// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  client_id: 'teste',
  authorize_url:'http://127.0.0.1:9000/oauth2/authorize?',
  redirect_uri:'http://127.0.0.1:4200/auth/authorized',
  scope:'openid profile',
  response_type:'code',
  response_mode:'form_post',
  code_challenge_method:'S256',
  code_challenge:'T-xl9hy1F5pmy8-bcYIrMNac_TjhwaiVC_o-0Eb0IGo',
  code_verifier: 'dbBjwS3cYljGnwoSul5pDIKGp9HWgunMXu7zWrbughs',
  token_url: 'http://127.0.0.1:9000/oauth2/token',
  grant_type: 'authorization_code',
  grant_type_refresh_token: 'refresh_token',
  resource_user_url: 'http://127.0.0.1:8081/',
  logout_url: 'http://127.0.0.1:9000/logout'
  // apiURL:'https://localhost:7286/',
  // apiAuth:'https://localhost:7027/',
  // apiCashier: 'https://localhost:7176/'
};
