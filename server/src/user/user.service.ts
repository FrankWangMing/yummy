import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Meet } from '../meet/schemas/meet.schema'
import { Model } from 'mongoose'
import { User } from './schemas/user.schema'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Meet.name) private readonly meetModel: Model<Meet>
  ) { }

  async findOneAndUpdate(user_id, argument) {
    return this.userModel.findOneAndUpdate({ user_id }, argument, {
      new: true,
      upsert: true,
      runValidators: true
    })
  }

  async findOne(argument) {
    return this.userModel.findOne(argument)
  }
  async deleteUser() {
    // return await this.meetModel.updateOne({ meet_id }, {
    //   $pull: { user_ids: user_id }
    // })
  }
}
