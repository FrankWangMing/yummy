import { HttpService } from '@nestjs/axios'
import { Body, Controller, Post } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { WXBizDataCrypt } from '../weixin/WXBizDataCrypt'
import { PrismaClient } from '@prisma/client'

@Controller('wx')
export class WxUserController {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaClient
  ) {}

  //   @Post('login')
  //   async login(@Body() params) {
  //     console.log(params)

  //     return (
  //       await firstValueFrom(
  //         this.httpService.get(
  //           `https://api.weixin.qq.com/sns/jscode2session?appid=wx74d45d88c507ebaf&secret=0c055cd1fcb74c29fdfc5386b80358d8&js_code=${params.code}&grant_type=authorization_code`
  //         )
  //       )
  //     ).data
  //   }
  @Post('login')
  async login(@Body() params) {
    console.log(params)
    const data = (
      await firstValueFrom(
        this.httpService.get(
          `https://api.weixin.qq.com/sns/jscode2session?appid=wx74d45d88c507ebaf&secret=0c055cd1fcb74c29fdfc5386b80358d8&js_code=${params.code}&grant_type=authorization_code`
        )
      )
    ).data
    return this.prisma.wXUser.upsert({
      where: {
        openId: data.openid
      },
      create: {
        openId: data.openid,
        UnionId: data.unionid
      },
      update: {}
    })
    // return (
    //   await firstValueFrom(
    //     this.httpService.post(
    //       `https://api.weixin.qq.com/wxa/checksession?access_token=${data.session_key}`,
    //       { openid: data.openid, signature: 'xxxxx', sig_method: 'hmac_sha256' }
    //     )
    //   )
    // ).data
  }
  @Post('checkSession')
  async checkSession(@Body() params) {
    console.log(params)
    const accessToken = 'tG4ncR82yiJXvRgM0MO5gg=='
    return (
      await firstValueFrom(
        this.httpService.post(
          `https://api.weixin.qq.com/wxa/checksession?access_token=${accessToken}`,
          { openid: 'xxxxxxxxx', signature: 'xxxxx', sig_method: 'hmac_sha256' }
        )
      )
    ).data
  }
  @Post('userInfo')
  async userInfo(@Body() params) {
    console.log(params)
    const {
      encryptedData,
      iv,
      appId = 'oHhIA0dFZBqkJNOUhV3r5JLewPjI',
      sessionKey = 'tG4ncR82yiJXvRgM0MO5gg=='
    } = params
    const pc = new WXBizDataCrypt(appId, sessionKey)
    const data = pc.decryptData(encryptedData, iv)
    console.log(pc)
    console.log(data)
  }

  @Post('selectRole')
  async selectRole(@Body() params) {
    console.log(params)

    return this.prisma.wXUser.update({
      where: {
        openId: params.openId
      },
      data: {
        role: params.role
      }
    })
  }
}
