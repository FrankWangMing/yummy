import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Meet } from './schemas/meet.schema'
import { Model } from 'mongoose'
import { User } from 'src/user/schemas/user.schema'

@Injectable()
export class MeetService {
  constructor(
    @InjectModel(Meet.name) private readonly meetModel: Model<Meet>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) { }

  async joinMeet(params) {
    console.log("params", params)
    const { meet_id, user_id } = params
    await this.userModel.updateOne({ user_id }, { $set: { meet_id } })
    const result = await this.meetModel.findOneAndUpdate(
      { meet_id, user_ids: { $ne: user_id } },
      { $push: { user_ids: user_id } },
      { new: true, upsert: false, runValidators: true }
    )
    return result
  }
  findOne(argument) {
    return this.meetModel.findOne(argument)
  }
  create(argument) {
    return this.meetModel.create(argument)
  }

  async findMeetByUserId(user_id: string) {
    return await this.meetModel.findOne({ user_ids: { $in: user_id } })
  }

  async findMeetByMeetId(meet_id: string) {
    const result = await this.meetModel.findOne({ meet_id })
    return result
  }

  async deleteUserIdInMeet(meet_id: string, user_id: string) {
    return await this.meetModel.updateOne({ meet_id }, {
      $pull: { user_ids: user_id }
    })
  }



}
