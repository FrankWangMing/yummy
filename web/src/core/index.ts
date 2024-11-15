import { SocketCore } from './socket.ts'
import { MediaController } from './medias.ts'
import { MeetController } from './meet.ts'
import { Api } from './http.ts'
import { VideoController } from './video.ts'

export const socketCore = new SocketCore()
export const mediaController: MediaController = new MediaController()
export const http = new Api(socketCore)
export const videoController = new VideoController()

export const meet = new MeetController(http, socketCore, mediaController,videoController)
