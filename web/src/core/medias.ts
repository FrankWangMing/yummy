export class MediaController {
  navigator: Navigator = navigator;
  constructor() { }
  get mediaDevices() {
    return this.navigator.mediaDevices;
  }
  async getUserMedia() {
    console.log(this.mediaDevices)
    return await this.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
  }
}
