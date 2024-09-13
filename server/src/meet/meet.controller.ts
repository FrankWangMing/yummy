import { Body, Headers, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { MeetService } from './meet.service'
import { ConnectedSocket } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { MeetGateway } from './meet.gateway'
import { v4 as uuidv4 } from 'uuid'
import { Meet } from './schemas/meet.schema'
import { UserService } from 'src/user/user.service'
type HeaderType = {
  socket_id: string
  user_id: string

}

@Controller('meet')
export class MeetController {
  constructor(
    private readonly meetService: MeetService,
    private readonly userService: UserService,
    private readonly meetGateWay: MeetGateway
  ) { }

  @Get('create')
  async createMeet(@Query() query, @Headers() header: HeaderType) {
    const { socket_id, user_id } = header
    console.log(query)
    console.log("createMeet")
    this.meetGateWay.server.socketsJoin(query)
    const meet_id = uuidv4()
    let result: Meet
    try {
      let check = await this.meetService.findOne({ owner_id: user_id })
      if (check) {
        result = check
      } else {
        result = await this.meetService.create({ meet_id, user_ids: [user_id], owner_id: user_id })
      }
      this.userService.findOneAndUpdate(user_id, {
        meet_id
      })
      console.log(result)
      this.meetGateWay.server.socketsJoin(result.meet_id)
    } catch (error) {
      console.log(error)
    }
    return result
  }

  @Post('join')
  joinMeet(@Body() body, @Headers('user_id') user_id: string) {
    const { meet_id, socket_id } = body
    this.meetGateWay.server.to(meet_id).except(socket_id).emit("joinMeet", {
      user_id
    })
    return this.meetService.joinMeet({
      user_id,
      meet_id,
    })
  }



  @Get('reconnect')
  async reconnectMeet(@Query() query, @Headers() header: HeaderType) {
    const { socket_id, user_id } = header
    const result = await this.meetService.findMeetByUserId(user_id)
    console.log(result)
    if (result) {
      const { meet_id } = result
      console.log("result", result)
      this.meetGateWay.server.to(meet_id).except(socket_id).emit("joinMeet", {
        meet_id,
        socket_id,
        user_id
      })
      // socket.join(meet_id)
    }
    console.log(result)
    return result
  }

  @Post('leave')
  leaveMeet(@Body() body, @Headers() header: HeaderType) {
    // const { socket_id, user_id } = header
    // const { meet_id } = body
    // console.log("leaveMeet")
    // try {
    //   this.meetGateWay.server.to(meet_id).except(socket_id).emit("leaveMeet", {
    //     socket_id
    //   })
    // } catch (error) {

    // }
    // return this.meetService.deleteUserIdInMeet(body.meet_id, user_id)
  }

}
