import React from "react";
import "./App.css";
import { Outlet } from "react-router-dom";

const App = () => {
  // useCreation(()=>{
  //     const  peer = new Peer();
  //     peer.on('open', function(id) {
  //         console.log('My peer ID is: ' + id);
  //         // navigator.mediaDevices.getUserMedia(
  //         //     { video: true, audio: true },
  //         //     (stream) => {
  //         //         console.log(stream)
  //         //         // const call = peer.call(id, stream);
  //         //         // call.on("stream", (remoteStream) => {
  //         //         //     // Show stream in some <video> element.
  //         //         // });
  //         //     },
  //         //     (err) => {
  //         //         console.error("Failed to get local stream", err);
  //         //     },
  //         // );
  //     });
  //     peer.on("connection", (conn) => {
  //         conn.on("data", (data) => {
  //             // Will print 'hi!'
  //             console.log(data);
  //         });
  //         conn.on("open", () => {
  //             conn.send("hello!");
  //         });
  //     });
  //
  // },[])

  return <Outlet />;
};

export default App;
