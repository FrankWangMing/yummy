import { Token } from './token.model'

export class Auth<T> extends Token {
  user: T
}
