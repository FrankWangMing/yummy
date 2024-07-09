import Peer from "peerjs";
import {Button, Input} from "antd";
import {useState} from "react";
const id ="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')[Math.ceil(Math.random()*10)]

export default function Example() {





    const [otherId,setOtherId] = useState()

    const open = ()=>{
        const constraints = {
            'video': true,
            'audio': true
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                console.log('Got MediaStream:', stream);
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
            });
    }
    const connect = () =>{

    }
    // Set up an asynchronous communication channel that will be
// used during the peer connection setup
    const signalingChannel = new SignalingChannel(remoteClientId);
    signalingChannel.addEventListener('message', message => {
        // New message from remote client received
    });

// Send an asynchronous message to the remote client
    signalingChannel.send('Hello!');
    async function makeCall() {
        const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        const peerConnection = new RTCPeerConnection(configuration);
        signalingChannel.addEventListener('message', async message => {
            if (message.answer) {
                const remoteDesc = new RTCSessionDescription(message.answer);
                await peerConnection.setRemoteDescription(remoteDesc);
            }
        });
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        signalingChannel.send({'offer': offer});
    // Listen for local ICE candidates on the local RTCPeerConnection
    peerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
            signalingChannel.send({'new-ice-candidate': event.candidate});
        }
    });

// Listen for remote ICE candidates and add them to the local RTCPeerConnection
    signalingChannel.addEventListener('message', async message => {
        if (message.iceCandidate) {
            try {
                await peerConnection.addIceCandidate(message.iceCandidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });
    }
    return (
        <div className={"flex h-screen w-screen justify-center items-center bg-[#D8D8D8]"}>
            <div>ID:{id}</div>
             <div>
                 <video></video>
                 <Button  onClick={open} >开始</Button>
                 <Input value={otherId} onChange={(r)=>{
                     console.log()
                     setOtherId(r.target.value)
                 }}></Input>
                 <Button onClick={connect}  >连接</Button>
             </div>
        </div>

    )
}
