export class MediaController{

    navigator:Navigator = navigator;
    constructor(){

    }
    get mediaDevices(){
        return this.navigator.mediaDevices;
    }
    async getUserMedia(){
        return await this.mediaDevices.getUserMedia({
            audio:true,
            video:true
        });
    }
}

