import { useState } from 'react'

import './App.css'
import Peer from "peerjs";


function App() {
  const [count, setCount] = useState(0)

    const  peer = new Peer();
    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
    });
  return (
    <>
      <h1 className={"text-2xl"}>hello</h1>
    </>
  )
}

export default App
