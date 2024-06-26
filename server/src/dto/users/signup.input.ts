import { IsNotEmpty, MinLength } from 'class-validator'

export class SignupInput {
  // @IsPhoneNumber()
  phone: string

  @IsNotEmpty()
  @MinLength(8)
  password: string

  username: string

  userImg?: string
}
