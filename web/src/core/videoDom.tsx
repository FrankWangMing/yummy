import React from "react";
import { createElement, forwardRef, useImperativeHandle, useRef } from "react";
import { Tools } from "./tools";

// const VideoDom = ()=>{
//     const ref = useRef<HTMLVideoElement|null>(null)
//     useImperativeHandle(ref,()=>({
//         play:()=>{
//             ref.current?.play()
//             return void
//         }
//     }))
//     return <video ref={ref}/>
// }

// export default forwardRef(VideoDom);
const VideoDom =  ()=> {
    const ref = useRef<HTMLVideoElement | null>(null)
    useImperativeHandle(ref, () => ({
        play: () => {
            ref.current?.play()
        }
    }))
    return <video key={Tools.uuid()} ref={ref} />
}

export class VideoController extends Map<string, any> {
    constructor() {
        super();
        this.create()
    }
    render() {
        return Array.from(this.values()).map((f) => {
            return f()
        })
    }
    create(){
        this.set("remote",VideoDom)
    }
}

