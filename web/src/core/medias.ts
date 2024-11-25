export class MediaController {
  navigator: Navigator = navigator;
  constructor() { }
  get mediaDevices() {
    return this.navigator.mediaDevices;
  }
  async getUserMedia() {
    console.log(this.mediaDevices)
    return await this.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,   // 启用回音消除
        noiseSuppression: true,   // 启用噪声抑制
        autoGainControl: true     // 启用自动增益控制
      },
      // audio: false,
      video: true,
    });
  }
}
