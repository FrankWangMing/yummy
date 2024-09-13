import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Room } from './schemas/room.schema'
import { Model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>
  ) {}
  async create(createRoomDto: Room) {
    const {user_id} = createRoomDto
    const room_id = uuidv4()
    const room = new Room()
    room.room_id = room_id
    room.user_id = user_id
    let result = {}
    try {
      let check = await this.roomModel.find({ owner_id:user_id })
      if(check.length){
        result = check
      }else{
        result = this.roomModel.create({ room_id, user_id: [user_id],owner_id:user_id })
      }
    } catch (error) {
      console.log(error)
    }


    return result
  }

  async joinRoom(params) {
    console.log("params",params)
    const {room_id,user_id} = params
    console.log(user_id)
    let result =await this.roomModel.findOneAndUpdate(
      {room_id},
      { $push: { user_id: user_id } },
      { new: false, upsert: true, runValidators: true }
    )
    return result
  }

  findOne(id: number) {
    return `This action returns a #${id} room`
  }

  update(id: number) {
    return `This action updates a #${id} room`
  }

  remove(id: number) {
    return `This action removes a #${id} room`
  }
}
