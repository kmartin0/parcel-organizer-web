import {Oauth2Credentials} from './oauth2-credentials';

export interface User {
  id?: string
  email?: string
  name?: string
  password?: string
  oauth2Credentials?: Oauth2Credentials
}
