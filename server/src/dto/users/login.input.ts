import { IsNotEmpty, MinLength } from 'class-validator'

export class LoginInput {
  // @IsPhoneNumber()
  phone: string
  username: string
  @MinLength(8)
  password: string

  @IsNotEmpty()
  type: 'mobile' | 'account'
}
