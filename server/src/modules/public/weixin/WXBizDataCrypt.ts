/* eslint-disable prettier/prettier */
import { createDecipheriv } from 'crypto'
export class WXBizDataCrypt {
  appId: string
  sessionKey: string
  constructor(appId, sessionKey) {
    this.appId = appId
    this.sessionKey = sessionKey
  }
  decryptData(encryptedData, iv) {
    const sessionKey = Buffer.from(this.sessionKey, 'base64')
    encryptedData = Buffer.from(encryptedData, 'base64')
    iv = Buffer.from(iv, 'base64')

    try {
      // 解密
      const decipher = createDecipheriv('aes-128-cbc', sessionKey, iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      let decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      decoded = JSON.parse(decoded)
      console.log('decoded', decoded)

      // if (decoded.watermark.appid !== this.appId) {
      //   throw new Error('Illegal Buffer')
      // }
      return decoded
    } catch (err) {
      throw new Error('Illegal Buffer')
    }
  }
}
